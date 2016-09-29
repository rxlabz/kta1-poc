const exos = [
    {
        title: 'Hello U!',
        method: 'hello',
        description: 'Écrivez une fonction *hello* qui :\n\n- renvoie "Hello MonNom!" si "MonNom" est passé en paramètre\n- renvoie "Hello World!" si aucun paramètre n\'est passé',
        exemple: "hello('Joe'); // doit renvoyer 'Hello Joe!'",
        prefill: "function hello(nom){\n\t/* ? */\n}",
        hint: "'a' + 'b' = 'ab'",
        level: 1
    },
    {
        title: 'Dernière lettre',
        method: 'getLastLetter',
        description: "La fonction getLastLetter( word ) doit renvoyer la dernière lettre du mot passé en paramètre. Elle doit renvoyer une chaine de caractères vide '' si une chaine vide est passée, et null si il n'y a aucun argument.",
        exemple: "getLastLetter('porte');// renvoie 'e'\ngetLastLetter('');// renvoie ''\ngetLastLetter();// renvoie null",
        prefill: "function getLastLetter(word){\n\t/* ? */\n}",
        hint: "les chaines sont des [listes]",
        level: 1
    },
    {
        title: 'Secondes en minutes',
        method: 'sec2m',
        description: 'Écrivez une fonction sec2m() qui convertit des secondes en minutes et secondes',
        exemple: "sec2m(123);// renvoie '2m 3s'\nsec2m(53);// renvoie '53s'",
        prefill: "function sec2m(sec){\n\t/* ? */\n}",
        hint: "pensez au fizz buzz",
        level: 1
    },
    {
        title: 'Liste en objet',
        method: 'arrayToObject',
        description: 'La fonction arrayToObject() doit convertir une liste de 3 elements en un object composé d\'une propriété *mail*, d\'une propriété *nom* et un prénom\n\nSi un champ est null ou vide \"\", l\'objet doit contenir \"Inconnu\"',
        exemple: "arrayToObject(['bob@gmail.com','Dupont','Bob']); // doit renvoyer un objet {mail:'bob@gmail.com', nom:'Dupont', prenom:'Bob'}",
        prefill: "function arrayToObject(list){\n\t/* ? */\n}",
        hint: "[0,1,2] -> {a,b,c}",
        level: 1
    },
    {
        title: 'Dans la zone',
        method: 'isInTheZone',
        description: 'La fonction isInTheZone(point, zone) recoit un objet point {x,y} et un objet zone {x,y,width,height}.\n\n Elle doit renvoyer **true** si le point est dans la zone, false dans le cas inverse.\n\nLa fonction doit renvoyer false s\'il manque un des paramètres.',
        exemple: "isInTheZone({x:10, y:10},{x:5, y:5, width:20, height:20}); // doit renvoyer true",
        prefill: "function isInTheZone(point, zone){\n\t/* ? */\n}",
        hint: "+ grand et + petit...",
        level: 2
    },
    {
        title: 'Secondes en heures, minutes',
        method: 'sec2h',
        description: 'Écrivez une fonction sec2h() qui convertit des secondes en minutes et secondes',
        exemple: "sec2h(3666);// renvoie \'1h 1m 6s\' sec2h(9945); // renvoie \'2h 45m 45s\'",
        prefill: "function sec2h(sec ){\n\t/* ? */\n}",
        hint: "pareil que sec2m!",
        level: 2
    },
    {
        title: 'Censure',
        method: 'censure',
        description: 'La fonction censure() reçoit un texte et une liste de mots/expressions interdit(e)s, la fonction doit renvoyer le texte dans lequel tous les mots interdits sont remplacés par un diese #.',
        exemple: "censure(\"Crénom d\'un chien, pas facile le sagouin.\", [\"Crénom d\'un chien\", \"sagouin\" , \"olibrius\"]); // doit renvoyer \"#, pas facile le #.\"",
        prefill: "function censure(unTexte, motsInterdits){\n\t/* ? */\n}",
        hint: "Séparez pour mieux régner...",
        level: 3
    },
    {
        title: 'Morpion : arbitre',
        method: 'valideMorpion',
        description: 'La fonction reçoit un grille de morpion ( un tableau de trois tableaux de trois cases ).\n\nchaque case peut contenir : un \'o\', une \'x\', un caractère vide\'\'.\n\nLa fonction doit renvoyer true si la grille est valide, false dans le cas contraire.\n\nCritères : \n\n- Ne contient que des \'o\', \'x\' ou des \'\'\n\n- les joueurs ont bien joué chacun à leur tour',
        exemple: "valideMorpion([\n\t['o','x',''],\n\t['o','x',''],\n\t['o','','']\n]); // doit renvoyer true\n\n" +
        "valideMorpion([\n\t['o','x',''],\n\t['o','',''],\n\t['o','','']\n]); // doit renvoyer false",
        prefill: "function valideMorpion(grille){\n\t/* ? */\n}",
        hint: "des colonnes et des lignes ! (et des diagonales)",
        level: 3
    },
    {
        title: 'Morpion : qui gagne ?',
        method: 'analyseMorpion',
        description: 'La fonction reçoit un grille de morpion ( un tableau de trois tableaux de trois cases ).\n\n\n\nLa fonction renvoie\n\n- 1 si les \'o\' ont gagné,\n\n- 2 si les \'x\' ont gagné,\n\n- 0 s\'il n\'y a pas de vainqueurs\n\n- -1 si la grille est invalide',
        exemple: "analyseMorpion([\n\t['o','x',''],\n\t['o','x',''],\n\t['o','','']\n]); // doit renvoyer 1",
        prefill: "function analyseMorpion(grille){\n\t/* ? */\n}",
        hint: "des colonnes et des lignes ! (et des diagonales)",
        level: 4
    }
];

let app;

const SRV = '/run';
const debugMode = false;

function init() {
    let templater = new Templater();

    let db = new LocalDB();
    let service = new KTaService(SRV, db);
    app = new App(exos, templater, service, editor, debugMode);
}

class App {

    get currentExo() {
        return this.exos[this.counter];
    }

    constructor(exos, templater, service, editor, DBG) {
        this.DBG = DBG;
        this.exos = exos;
        this.editor = editor;
        this.templater = templater;
        this.service = service;
        this.validator = new Validator();
        this.counter = this.service.getLastKataIndex();
        //test
        this.fill();
    }

    get editorHeight() {
        const BAR_HEIGHT = 140;
        let h = window.innerHeight - byId('instruction').clientHeight - BAR_HEIGHT;
        //console.log('editorHeight', window.innerHeight, byId('instruction').clientHeight, h);
        return isNaN(h) ? 140 : Math.max(h,140);
    }

    // TODO move to templater
    // TODO resize event
    initEditor() {
        let savedCode = this.service.getCode(this.currentExo.method);
        if (savedCode)
            this.editor.setValue(savedCode);

        byId('editor').style.height = this.editorHeight + 'px';
        this.editor.resize();
    }

    hint() {
        let hint = byId('hint');
        console.log('hint', this.currentExo.hint, hint);
        hint.innerText = this.currentExo.hint;
        hint.style.display = 'block';
    }

    next() {
        if (this.counter < exos.length - 1) {
            this.counter++;
            this.service.saveCurrentKata(this.counter);
            this.fill();
        } else {
            alert('Terminé. Bravo');
        }
    }

    prev() {
        if (this.counter > 0) {
            this.counter--;
            this.templater.clear();
            this.fill();
        }
    }

    send() {
        let currentMethod = this.currentExo.method;
        let code = this.editor.getValue();
        this.service.saveCode(currentMethod, code);
        let valResult = this.validator.isValid(code);
        if (valResult === true)
            this.service.send(currentMethod, code, this.onMethodResult.bind(this));
        else
            alert('Ces fonctions ne sont pas autorisées : ' + valResult.toString().replace('(', ''));

        if( ! this.DBG )
            ga('send', 'event', 'kataEvent', 'send', currentMethod, this.counter);
    }

    fill() {
        console.log('fill');
        this.templater.clear();
        this.templater.updatedMenuSelection(this.counter);
        this.templater.fillMenu(this.exos, this.counter, this.onMethodSelection.bind(this));
        this.templater.fillTemplate(this.currentExo, this.counter);
        this.initEditor();
    }

    onMethodResult(results) {
        let numError = results.results.filter((item)=> item.status != 1).length;
        this.templater.fillFeedback(numError, results.results);

        if( ! this.DBG )
            ga('send', 'event', 'kataEvent', 'result', this.currentExo.method + "-" + (numError == 0 ? 'OK' : 'ERROR'), this.counter);
    }

    onMethodSelection(methodId) {
        this.counter = methodId;
        this.fill();
        this.initEditor();
    }

    reset() {
        this.editor.setValue(this.currentExo.prefill);
        this.localDB.set(this.currentExo.method, '');
    }

    sendMail(email, msg){
        this.service.sendMail(email, msg);
        this.templater.clearContactForm();
    }

    showFeedbackForm(){
        this.templater.showFeedbackForm();
    }

    closeFeedbackForm(){
        this.templater.hideFeedbackForm();
        //hide(byId('feedback-form'));
    }
}

class LocalDB {
    set(method, code) {
        let res = localStorage.setItem(method, code);
        console.log('LocalDB', method, code);
        console.log('LocalDB.set', res);
    }

    get(method) {
        return localStorage.getItem(method);
    }
}

class Validator {
    isValid(code) {
        let invalids = ['alert(', 'prompt(', 'confirm(',];
        let detectedInvalids = invalids.filter((m)=>code.indexOf(m) > 0);

        return detectedInvalids.length == 0 ? true : containsInvalid;
    }
}

class Templater {

    constructor() {
        this.initStyles();
        this.menuInitialized = false;
    }

    initStyles() {
        rmClass(byId('feed'), "error");
        rmClass(byId('feed'), "ok");
    }

    /**
     *
     * @param exos
     * @param currentIndex
     * @param clicHandler
     */
    fillMenu(exos, currentIndex, clicHandler) {

        this.updatedMenuSelection(currentIndex);

        if (this.menuInitialized) return;

        let menu = byId('kata-menu');

        let ul = _el('ul');
        exos.map((e, index)=> {
            let li = _el('li');
            let bt = _el('a');
            addClass(bt, 'menu-link');
            //if (index == currentIndex) addClass(bt);
            bt.addEventListener('click', ()=> {
                clicHandler(index);
            });
            bt.innerText = e.title;
            li.appendChild(bt)
            return li;
        }).forEach(bt=>menu.appendChild(bt));

        this.updatedMenuSelection(currentIndex);
        this.menuInitialized = true;
    }

    updatedMenuSelection(currentIndex) {
        byClass('menu-link').forEach((item, index)=> {
            if (index == currentIndex) {
                addClass(item, 'selected');
                return;
            }
            rmClass(item, 'selected');
        });
    }

    fillTemplate(exo, index) {
        this.initTestButtons();
        removeChildren(byId('instruction'));

        this.fillKataHeader(index, exo);

        this.fillKataTitle(exo);

        this.fillKataDescription(exo);

        this.fillKataExemple(exo);
        this.fillKataHint(exo);

        editor.setValue(exo.prefill);
    }

    fillKataHeader(index, exo) {
        let header = document.createElement('div');
        header.innerText = 'Kata ' + (index + 1) + ' - Niveau ' + exo.level;
        addClass(header, 'kata-header');
        byId('instruction').appendChild(header);
    }

    fillKataTitle(exo) {
        let title = document.createElement('h2');
        title.innerText = exo.title;
        byId('instruction').appendChild(title);
    }

    fillKataDescription(exo) {
        let desc = document.createElement('p');
        desc.innerHTML = markdown.toHTML(exo.description);
        byId('instruction').appendChild(desc);
    }

    fillKataExemple(exo) {
        let ex = document.createElement('code');
        ex.innerText = exo.exemple;
        addClass(ex, 'exemple');
        byId('instruction').appendChild(ex);
    }

    fillKataHint(exo) {
        let hint = document.createElement('p');
        hint.id = 'hint';
        addClass(hint, 'hint');
        hide(hint);
        hint.innerHTML = exo.hint;
        byId('instruction').appendChild(hint);
    }

    fillFeedback(numError, results) {
        //byId('feed').innerText = this.responseText;
        this.clearFeedback();

        if (numError == 0) {
            byId('bt-next').style.display = 'flex';
            hide(byId('bt-send'));
        }

        console.log('fillFeedback', results);
        //addClass(byId('feed'), numError > 0 ? "error" : "ok");
        let msgs = results.map((item)=> {
            let row = _el('div');
            row.innerText = item.msg;
            let resultClass = item.status < 1 ? "error" : "ok";
            addClass(row, resultClass);
            return row;
        });

        msgs.forEach((item)=> {
            byId('feed').appendChild(item);
        });
    }

    clear() {
        removeChildren(byId('instruction'));
        this.clearFeedback();
    }

    clearFeedback() {
        let feedBox = byId('feed');
        removeChildren(feedBox);
    }

    clearContactForm(){
        byId('fldMail').value = '';
        byId('fldMsg').value = '';
    }

    initTestButtons() {
        byId('bt-send').style.display = 'flex';
        hide(byId('bt-next'));
    }

    hideFeedbackForm() {
        this.clearContactForm();
        byId('bt-feedback').style.display = 'flex';
        hide(byId('feedback-form'));
    }

    showFeedbackForm() {
        byId('feedback-form').style.display = 'flex';
        hide(byId('bt-feedback'));
    }
}

class KTaService {

    constructor(path, db) {
        this.path = path;
        this.db = db;
    }

    send(methodName, code, onDataHandler) {
        this.lastDataHandler = onDataHandler;
        let call = new XMLHttpRequest();
        call.onload = this.onData.bind(this);
        let params = {};
        params.methodName = methodName;
        params.code = code;

        call.open('POST', this.path);
        call.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        call.send(JSON.stringify(params));
    };

    sendMail(email, msg){
        this.lastDataHandler = function(res){
            console.log('sendMail', res);
        };
        let call = new XMLHttpRequest();
        call.onload = this.onFeedbackResult.bind(this);
        let params = {};
        params.sender = email;
        params.msg = msg;

        call.open('POST', '/mail');
        call.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        call.send(JSON.stringify(params));
    }

    getCode(method) {
        return this.db.get(method);
    }

    saveCode(currentMethod, code) {
        this.db.set(currentMethod, code);
    }

    getLastKataIndex() {
        var lIndex = this.db.get('lastKataIndex');
        console.log('getLastKataIndex', lIndex);
        return lIndex ? parseInt(lIndex) : 0;
    }

    saveCurrentKata(index) {
        this.db.set('lastKataIndex', index);
    }

    onData(r) {
        console.log(r.currentTarget.responseText);
        let res = JSON.parse(r.currentTarget.responseText);
        this.lastDataHandler(res);
    }

    onFeedbackResult(r){
        byId('bt-feedback').style.display = 'flex';
        hide(byId('feedback-form'));
    }
}

