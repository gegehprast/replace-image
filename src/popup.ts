const ENABLE_BTN = document.getElementById('enable') as HTMLButtonElement
const DISABLE_BTN = document.getElementById('disable') as HTMLButtonElement
const RELOAD_BTN = document.getElementById('reload') as HTMLButtonElement

function showEnableBtn() {
    ENABLE_BTN.style.display = 'none'
    DISABLE_BTN.style.display = 'inline-block'
}

function showDisableBtn() {
    ENABLE_BTN.style.display = 'inline-block'
    DISABLE_BTN.style.display = 'none'
}

function enable(e: MouseEvent) {
    chrome.runtime.sendMessage('enable', (res) => {
        if (!chrome.runtime.lastError && res === 1) {
            showEnableBtn()

            return
        }
    })
}

function disable(e: MouseEvent) {
    chrome.runtime.sendMessage('disable', (res) => {
        if (!chrome.runtime.lastError && res === 1) {
            showDisableBtn()

            return
        }
    })
}

function reload(e: MouseEvent) {
    chrome.runtime.sendMessage('reload')
}

chrome.runtime.sendMessage('is-enabled', (res) => {
    if (chrome.runtime.lastError) {
        return
    }

    if (res.enabled === true) {
        showEnableBtn()
    } else {
        showDisableBtn()
    }
})

if (ENABLE_BTN != null) {
    ENABLE_BTN.addEventListener('click', enable)
    DISABLE_BTN.addEventListener('click', disable)
    RELOAD_BTN.addEventListener('click', reload)
}
