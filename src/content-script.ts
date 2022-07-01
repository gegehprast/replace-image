const SELECTOR = 'h1, h2, h3, h4, h5, h6, a, span, li, button'
const elements = document.querySelectorAll(SELECTOR) as NodeListOf<HTMLElement>

function replaceInText(element: Node, pattern: RegExp | string, replacement: string) {
    for (let node of element.childNodes) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                replaceInText(node, pattern, replacement);
                break;
            case Node.TEXT_NODE:
                node.textContent = node.textContent.replace(pattern, replacement);
                break;
            case Node.DOCUMENT_NODE:
                replaceInText(node, pattern, replacement);
        }
    }
}

chrome.runtime.sendMessage('what-to-censor', (res: { words: string[] }) => {
    if (chrome.runtime.lastError) {
        return
    }
    
    if (res.words.length > 0) {
        const regularExpression = new RegExp(res.words.join('|'), 'gim')
        
        replaceInText(document.querySelector('html'), regularExpression, '***')
    }
    
    return
})
