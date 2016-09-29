var express = require('express');
var bp = require('body-parser');
var vm = require('vm');
var _ = require('underscore');
var mailer = require('nodemailer');

var app = express();

app.use(express.static(__dirname + '/public'));

app.use(bp.json());
app.use(bp.urlencoded({extended: false}));

var ERR = 'ERROR !!! ';

var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'module.e@gmail.com',
        pass: 'W3r4srk0#2412'
    }
};

function sendMail(msg, sender) {

    console.log('msg', msg);

    var transport = mailer.createTransport(smtpConfig);

    transport.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });

    var mailData = {
        from: 'module.e@gmail.com',
        to: 'erick@rxlabz.com',
        subject: 'Test nodemail',
        text: sender + '\n' + msg
    };
    transport.sendMail(mailData);
}

app.post('/mail', function (req, res) {
    var msg = req.body.msg;
    var sender = req.body.sender;
    sendMail(msg, sender);
    res.send('{"res":"ok"}');
});

app.use(function (req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
 });

app.post('/run', function (req, res) {
    console.log('/run', req.body.methodName);

    var script;
    var expectation;
    //var r = '';
    var result;

    var resp = {method: req.body.methodName, results: []};

    for (var c in tests) {
        var t = tests[c];
        //console.log('tests[c].method', tests[c].method);
        if (tests[c].method == req.body.methodName) {

            //console.log('tests[c].method', tests[c].method, '== req.body.methodName', req.body.methodName);
            var m = tests[c].method;

            // lance les "tests" de la méthode
            for (var i in tests[c].calls) {
                var call = t.calls[i];
                var hasParam = call.length > 0;
                if (hasParam) {
                    var params = call;
                }
                var code = req.body.code;
                console.log('code', code);

                // TODO cleaner l'appel => jasmine-node ? Mocha ?
                script = new vm.Script(code);

                var context = vm.createContext({console: console});

                expectation = t.expects[i];

                var paramsChain;
                try {

                    script.runInContext(context);
                    // une fois le script executé on peut accéder à la méthode via le contexte
                    if (hasParam) {

                        result = context[m].apply(context, params);
                        paramsChain = params.reduce(
                            function (t, c, index, arr) {
                                return t + getDescription(c) + (index < arr.length - 1 ? ',' : '')
                            }, '');
                        //paramsChain = params.reduce((t, c, index, arr)=> t + getDescription(c) + (index < arr.length - 1 ? ',' : ''), '');
                        console.log('paramsChain', paramsChain);
                    } else
                        result = context[m].apply(context);

                    var methodCallString = m + '( ' + (paramsChain ? paramsChain : '') + ' )';
                    var status = _.isEqual(result, expectation) ? 1 : 0;
                    var msg = getTestMessage(result, expectation, methodCallString);

                    resp.results[i] = {status: status, msg: msg};
                } catch (err) {
                    console.log(ERR, dump(err));
                    resp.results[i] = {status: 0, msg: err.message};
                }
            }
        }
    }
    res.send(resp);
});

app.post('/exc', function (req, res) {
    //console.log(req.body);
    console.log('/exc', req.body.methodName);

    //sendMail();

    var script;
    var expectation;
    //var r = '';
    var result;

    var resp = {method: req.body.methodName, results: []};

    for (var c in tests) {
        var t = tests[c];
        //console.log('tests[c].method', tests[c].method);
        if (tests[c].method == req.body.methodName) {

            //console.log('tests[c].method', tests[c].method, '== req.body.methodName', req.body.methodName);
            var m = tests[c].method;

            // lance les "tests" de la méthode
            for (var i in tests[c].calls) {
                var call = t.calls[i];
                var hasParam = call.length > 0;
                if (hasParam) {
                    var params = call;
                }
                var code = req.body.code;
                console.log('code', code);

                // TODO cleaner l'appel => jasmine-node ? Mocha ?
                script = new vm.Script(code);

                var context = vm.createContext({console: console});

                expectation = t.expects[i];

                var paramsChain;
                try {

                    script.runInContext(context);
                    // une fois le script executé on peut accéder à la méthode via le contexte
                    if (hasParam) {

                        result = context[m].apply(context, params);
                        paramsChain = params.reduce(
                            function (t, c, index, arr) {
                                return t + getDescription(c) + (index < arr.length - 1 ? ',' : '')
                            }, '');
                        //paramsChain = params.reduce((t, c, index, arr)=> t + getDescription(c) + (index < arr.length - 1 ? ',' : ''), '');
                        console.log('paramsChain', paramsChain);
                    } else
                        result = context[m].apply(context);

                    var methodCallString = m + '( ' + (paramsChain ? paramsChain : '') + ' )';
                    var status = _.isEqual(result, expectation) ? 1 : 0;
                    var msg = getTestMessage(result, expectation, methodCallString);

                    resp.results[i] = {status: status, msg: msg};
                } catch (err) {
                    console.log(ERR, dump(err));
                    resp.results[i] = {status: 0, msg: err.message};
                }
            }
        }
    }
    res.send(resp);
});

function getTestMessage(ret, exp, methodCallString) {
    return _.isEqual(ret, exp)
        ? methodCallString + ' => ' + getDescription(exp) + ' => OK '
        : 'ERROR : ' + methodCallString + ' => devrait renvoyer ' + getDescription(exp) + ' => renvoie : ' + getDescription(ret);
}

function getDescription(v) {

    if (v === null) return 'null';
    if (v === false) return 'false';
    if (_.isObject(v) && !_.isArray(v))
        return '{ ' + dump(v) + ' }';
    else if (_.isObject(v) && _.isArray(v)) {
        //let res = '[' +v.map(item=>item?item:'null').toString()+ ']';
        console.log('Array dump', v.join('","'));
        var reduced = v.reduce(function (t, c, index, arr) {
            return t + getDescription(c) + (index < arr.length - 1 ? ',' : '');
        }, '');
        return '\[ ' + reduced + '\ ]';
        //return '\[ ' + v.reduce((t, c, index, arr) => ) + '\ ]';
        //return res;
    }

    return typeof v === "string" ? '\"' + v.toString() + '\"' : v;

}

app.listen(8001, function () {
//app.listen(8080, function () {
    console.log('yo express ! Running KTa1 on 8080...');
});

var XC = function () {
    this.rdString = function (length) {
        var res = "";
        for (var i = 0; i < length; i++) {
            res += abc[Math.round(Math.random() * abc.length)];
        }
        return res;
    };

    this.rdInt = function (max) {
        return Math.floor(Math.random() * max);
    };

    this.getLastLetter = function (word) {
        return word ? (word == '' ? '' : word[word.length - 1] ) : null;
    }

    this.sec2m = function (s) {
        return s > 60 ? Math.floor(s / 60) + 'm ' + s % 60 + 's' : s + 's';
    }

    this.sec2h = function (sec) {
        var h = Math.floor(sec / 3600);
        var m = Math.floor((sec % 3600) / 60);

        return (h > 0 ? h + 'h ' : '') + m + 'm ' + ((sec % 3600) % 60) + 's';
    }

    this.valideMorpion = function (grille) {
        var n1 = 0, n2 = 0;
        var o = 'o', x = 'x';
        for (var i = 0; i < grille.length; i++) {
            var r = grille[i];
            for (var j = 0; j < r.length; j++) {
                switch (r[j]) {
                    case o:
                        n1++;
                        break;
                    case x:
                        n2++;
                        break;
                    case '':
                        break;
                    default:
                        return -1;
                }
            }
        }

        if (Math.max(n1, n2) - Math.min(n1, n2) > 1) return false;
        return true;
    }
}

var xc = new XC();

var abc = "abcdefghijklmnopqrstuvwxyz";
var rd_Hello = xc.rdString(6);
var rd_lastLetter0 = xc.rdString(6);
var rd_lastLetter1 = xc.rdString(6);

var rd_sec2m0 = xc.rdInt(1000);
var rd_sec2m1 = xc.rdInt(1000);
var rd_sec2h0 = xc.rdInt(10000);
var rd_sec2h1 = xc.rdInt(10000);

var rd_a2o0a = xc.rdString(8);
var rd_a2o0b = xc.rdString(8);
var rd_a2o0c = xc.rdString(8);

var rd_a2o1a = xc.rdString(8);
var rd_a2o1b = xc.rdString(8);
var rd_a2o1c = xc.rdString(8);

var tests = [
    {
        method: 'hello',
        calls: [[], ['Bob'], ['Joe'], [rd_Hello]],
        /*calls: [[], [{type:"String",value:'Bob'}], ['Joe'], [rd_Hello]],*/
        expects: ['Hello World!', 'Hello Bob!', 'Hello Joe!', 'Hello ' + rd_Hello + '!']
    },
    {
        method: 'getLastLetter',
        calls: [[], ['Bob'], [rd_lastLetter0], [rd_lastLetter1], ['']],
        expects: [null, 'b', xc.getLastLetter(rd_lastLetter0), xc.getLastLetter(rd_lastLetter1), '']
    },
    {
        method: 'sec2m',
        calls: [[], [rd_sec2m0], [rd_sec2m1], [323]],
        expects: [0, xc.sec2m(rd_sec2m0), xc.sec2m(rd_sec2m1), '5m 23s']
    },
    {
        method: 'arrayToObject',
        calls: [
            [['a', 'b', 'c']],
            [['a', null, '']],
            [[rd_a2o0a, rd_a2o0b, rd_a2o0c]],
            [[rd_a2o1a, rd_a2o1b, rd_a2o1c]]
        ],
        expects: [{mail: 'a', nom: 'b', prenom: 'c'}, {mail: 'a', nom: 'Inconnu', prenom: 'Inconnu'},
            {mail: rd_a2o0a, nom: rd_a2o0b, prenom: rd_a2o0c},
            {mail: rd_a2o1a, nom: rd_a2o1b, prenom: rd_a2o1c}
        ]
    }, {
        method: 'isInTheZone',
        calls: [
            [],
            [{x: 10, y: 10}, {x: 15, y: 15, width: 20, height: 20}],
            [{x: 10, y: 10}, {x: 5, y: 5, width: 20, height: 20}],
            [{x: 0, y: 0}, {x: 5, y: 5, width: 20, height: 20}],
            [{x: 10, y: 10}, {x: -5, y: -5, width: 20, height: 20}],
            [{x: 0, y: 0}, {x: -5, y: -5, width: 20, height: 20}],
            [{x: -10, y: -10}, {x: -50, y: -50, width: 20, height: 20}],
            [{x: -40, y: -40}, {x: -50, y: -50, width: 20, height: 20}]
        ],
        expects: [false, false, true, false, true, true, false, true]
    },
    {
        method: 'sec2h',
        calls: [[], [rd_sec2h0], [rd_sec2h1], [3666]],
        expects: [0, xc.sec2h(rd_sec2h0), xc.sec2h(rd_sec2h1), '1h 1m 6s']
    }, {
        method: 'censure',
        calls: [
            ["ab cd ef gh ij", ['aa', 'cd', 'cc', 'gh']],
            ["ab cd .ef gh ij", ['ef', 'cd']],
            ["abcd. ef gh ij", ['aa', 'cd']],
        ],
        expects: ["ab # ef # ij", "ab # .# gh ij", "abcd. ef gh ij"]
    }, {
        method: 'valideMorpion',
        calls: [
            [],
            [[['o', 'x', ''], ['o', 'x', ''], ['o', '', '']]],
            [[['o', '', ''], ['o', 'x', ''], ['o', '', '']]],
            [[['x', 'o', ''], ['o', 'y', ''], ['o', '', 'x']]],
            [[['x', 'o', ''], ['o', 'x', ''], ['o', 'x', 'o']]],
        ],
        expects: [true, true, false, false, true]
    }, {
        method: 'analyseMorpion',
        calls: [
            [],
            [[['o', 'x', ''], ['o', 'x', ''], ['o', '', '']]],
            [[['o', 'x', ''], ['o', 'x', ''], ['', 'o', 'o']]],
            [[['x', 'o', ''], ['o', 'x', ''], ['o', '', 'x']]],
            [[['x', 'o', ''], ['o', 'x', ''], ['o', 'x', 'o']]],
        ],
        expects: [0, 1, -1, 2, 0]
    },
];

function dump(o, indent) {
    var out = '';
    if (typeof indent === 'undefined') {
        indent = 0;
    }
    for (var p in o) {
        if (o.hasOwnProperty(p)) {
            var val = o[p];
            out += new Array(4 * indent + 1).join(' ') + p + ': ';
            if (typeof val === 'object') {
                if (val instanceof Date) {
                    out += 'Date "' + val.toISOString() + '"';
                } else {
                    out += '{\n' + dump(val, indent + 1) + new Array(4 * indent + 1).join(' ') + '}';
                }
            } else if (typeof val === 'function') {

            } else {
                out += '"' + val + '"';
            }
            out += ',\n';
        }
    }
    return out;
}