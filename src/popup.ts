const ENABLE_BTN = document.getElementById('enable') as HTMLButtonElement
const DISABLE_BTN = document.getElementById('disable') as HTMLButtonElement
const RELOAD_BTN = document.getElementById('reload') as HTMLButtonElement

function enable(e: MouseEvent) {
    chrome.runtime.sendMessage('enable', (res) => {
        console.log(chrome.runtime.lastError)
        console.log(res)
    })
}

function disable(e: MouseEvent) {
    chrome.runtime.sendMessage('disable', (res) => {
        console.log(chrome.runtime.lastError)
        console.log(res)
    })
}

function reload(e: MouseEvent) {
    chrome.runtime.sendMessage('reload', (res) => {
        console.log(chrome.runtime.lastError)
        console.log(res)
    })
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message) {
        case 'enable':
            ENABLE_BTN.style.display = 'none'
            DISABLE_BTN.style.display = 'inline-block'
            sendResponse(1)
            break;

        case 'disable':
            ENABLE_BTN.style.display = 'inline-block'
            DISABLE_BTN.style.display = 'none'
            sendResponse(1)
            break;

        case 'reload':
            console.log('reloaded')
            sendResponse(1)
            break;

        default:
            break;
    }
});

if (ENABLE_BTN != null) {
    ENABLE_BTN.addEventListener('click', enable)
    DISABLE_BTN.addEventListener('click', disable)
    RELOAD_BTN.addEventListener('click', reload)
}
