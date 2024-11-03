export const $ = selector => document.querySelector(selector);
export const $$ = selector => document.querySelectorAll(selector);

export const createElementWithClass = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

export const showModal = (content) => {
    const modal = $('#jobModal');
    const modalContent = $('#modalContent');
    modalContent.innerHTML = '';
    modalContent.appendChild(content);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

export const closeModal = () => {
    const modal = $('#jobModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

export const setDisplay = (element, value) => {
    element.style.display = value;
};

export const addClass = (element, className) => {
    element.classList.add(className);
};

export const removeClass = (element, className) => {
    element.classList.remove(className);
};

export const toggleClass = (element, className) => {
    element.classList.toggle(className);
};