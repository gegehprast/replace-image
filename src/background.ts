const enableRule = (cb: () => void) => {
    chrome.declarativeNetRequest.updateEnabledRulesets(
        {
            enableRulesetIds: ['ruleset_1']
        },
        () => {
            console.log('Rule enabled.')
            chrome.action.setIcon({ path: { '16': 'images/anya-16.png' } }, () => {
                console.log(chrome.runtime.lastError)
            })
            cb()
        }
    )
}

const disableRule = (cb: () => void) => {
    chrome.declarativeNetRequest.updateEnabledRulesets(
        {
            disableRulesetIds: ['ruleset_1']
        },
        () => {
            console.log('Rule disabled.')
            chrome.action.setIcon({ path: { '16': 'images/anya-off-16.png' } }, () => {
                console.log(chrome.runtime.lastError)
            })
            cb()
        }
    )
}

const reloadPage = (tabId: number, cb: () => void) => {
    chrome.tabs.reload(tabId, {}, cb)
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message, sender)
    switch (message) {
        case 'enable':
            enableRule(() => {
                chrome.runtime.sendMessage('enabled', () => {
                    console.log(chrome.runtime.lastError)
                    sendResponse(1)
                })
            })
            break;

        case 'disable':
            disableRule(() => {
                chrome.runtime.sendMessage('disabled', () => {
                    console.log(chrome.runtime.lastError)
                    sendResponse(1)
                })
            })
            break;

        case 'reload':
            if (sender.tab) {
                reloadPage(sender.tab.id, () => {
                    chrome.runtime.sendMessage('reloaded', () => {
                        console.log(chrome.runtime.lastError)
                        sendResponse(1)
                    })
                })
            } else {
                sendResponse(1)
            }
            break;
    
        default:
            break;
    }
})