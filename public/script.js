
function extractCommentElements(element) {
    if (!element) return null;
    const foundCommentElements = [];
    const elementQueue = [element];

    while (elementQueue.length > 0) {
        const currentElement = elementQueue.pop();

        for (var i = 0; i < currentElement.childNodes.length; i++) {
            const node = currentElement.childNodes[i];

            if (node.nodeType != Node.COMMENT_NODE) {
                elementQueue.push(node);
                continue;
            }

            foundCommentElements.push(node);
        }
    }

    return foundCommentElements;
}

class HatcherValueElement extends HTMLElement {
    constructor() {
        super();
        this.key = null;
        console.log('HMMMM');
    }
}

function issueElementTemplate(templateElement) {
    const templateElementClone = templateElement.cloneNode(true);
    templateElementClone.cacheValueElementMap = {}; // should be a map of string -> array
    console.log({ templateElementClone });

    const templateComments = extractCommentElements(templateElementClone.content);
    // console.log({ templateComments });

    for (const templateComment of templateComments) {
        const templateCommentKey = templateComment.data.trim();
        console.log({ templateCommentKey });

        const templateValueElement = document.createElement('hatcher-value')
        templateValueElement.key = templateCommentKey;
        console.log({ templateValueElement });

        templateComment.parentNode.replaceChild(templateValueElement, templateComment);
    }

    const hatcherTemplateValues = templateElementClone.content.querySelectorAll('hatcher-value') || [];
    for (const hatcherTemplateValue of hatcherTemplateValues) {
        if (!templateElementClone.cacheValueElementMap[hatcherTemplateValue.key])
            templateElementClone.cacheValueElementMap[hatcherTemplateValue.key] = [];

        templateElementClone.cacheValueElementMap[hatcherTemplateValue.key].push(hatcherTemplateValue);
    }

    console.log({ templateElementClone });

    return templateElementClone;
}


class HatcherSlotElement extends HTMLElement {
    static observedAttributes = ['value'];

    attributeChangedCallback(name, oldValue, newValue) {
        const innerHTML = this.render();
        this.innerHTML = innerHTML;
    }

    render() {
        return this.getAttribute('value');
    }
}


// customElements.define("hatcher-text", HatcherTextElement);
document.addEventListener('DOMContentLoaded', function() {
    // customElements.define("hatcher-template", HatcherTemplateElement);
    customElements.define("hatcher-value", HatcherValueElement);
});