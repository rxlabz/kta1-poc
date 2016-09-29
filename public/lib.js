function addClass(el, className) {
    if (el)
        el.classList.add(className);
}
function rmClass(el, className) {
    if (el)
        el.classList.remove(className);
}
function addRemoveClass(target, addClass, rmClass) {
    if (target) {
        target.classList.add(addClass);
        target.classList.remove(rmClass);
    }
    else
        console.log('no target to addRemoveClass...');
}
/**
 * applique une liste de style à un element
 * @param el
 * @param values
 */
function style(el, values) {
    for (var p in values) {
        el.style[p] = values[p];
    }
}
/**
 * set le z-index
 * @param el
 * @param newIndex
 */
function zId(el, newIndex) {
    el.style.zIndex = newIndex;
}
function byId(elId) {
    return document.getElementById(elId);
}

function byClass(className) {
    var elements = document.getElementsByClassName(className);
    return Array.prototype.slice.call(elements);
}
function hide(el) {
    el.style.display = 'none';
}
/**
 * renvoie <a href="">...</a>
 * @param text
 * @param link
 * @returns {Element}
 */
function href(text, link) {
    var a = document.createElement('a');
    a.setAttribute('href', link);
    a.textContent = text;
    return a;
}
function removeChildren(container) {
    [].slice.call(container.children).forEach(function (item) {
        container.removeChild(item);
        console.log('removeChild -> ', container, item);
    });
}
function tNode(text) {
    return document.createTextNode(text);
}


function child(parent){
    return [].slice.call(parent.children);
}

function mapChild(parent, action){
    return child(parent).map(action);
}

function _el(tag) {
    return document.createElement(tag);
}

/**
 * renvoie couleur aléatoire
 * @returns {string}
 */
function randColr() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
function addClass(el, className) {
    if (el)
        el.classList.add(className);
}
function rmClass(el, className) {
    if (el)
        el.classList.remove(className);
}
function addRemoveClass(target, addClass, rmClass) {
    if (target) {
        target.classList.add(addClass);
        target.classList.remove(rmClass);
    }
    else
        console.log('no target to addRemoveClass...');
}
function style(el, values) {
    for (var p in values) {
        el.style[p] = values[p];
    }
}
function zId(el, newIndex) {
    el.style.zIndex = newIndex;
}
function byId(elId) {
    return document.getElementById(elId);
}
//# sourceMappingURL=lib.js.map