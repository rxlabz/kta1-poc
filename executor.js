/**
 *
 * @type {{}}
 */


var exports = module.exports = {};

exports.executor = function () {

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

    this.methods = function () {

        this.hello = function(){

        }

        this.getLastLetter = function (word) {
            return word ? (word == '' ? '' : word[word.length - 1] ) : null;
        }

        this.sec2m = function (s) {
            return s > 60 ? Math.floor(s / 60) + 'm ' + s % 60 + 's' : s + 's';
        }

        this.sec2h = function (sec) {
            var h = Math.floor(sec / 3600);
            var m = Math.floor((sec % 3600)/60 );

            return (h > 0 ? h + 'h ' : '') + m + 'm ' + ((sec % 3600) % 60) + 's';
        }

        this.valideMorpion = function(grille) {
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
    };

    this.testData = [
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
            expects: ["ab ef ij", "ab # .# gh ij", "abcd. ef gh ij"]
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
        }
    ];

}
