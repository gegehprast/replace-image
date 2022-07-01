const CENSORED = chrome.runtime.getURL('censored.json')
let censoredWords: string[]
let enabled = true

const enableRule = (cb: () => void) => {
    chrome.declarativeNetRequest.updateEnabledRulesets(
        {
            enableRulesetIds: ['ruleset_1']
        },
        () => {
            enabled = true
            chrome.action.setIcon({ path: { '16': 'images/anya-16.png' } })

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
            enabled = false
            chrome.action.setIcon({ path: { '16': 'images/anya-off-16.png' } })

            cb()
        }
    )
}

const reloadActiveTab = async (cb: () => void) => {
    const tab = await getCurrentTab()

    chrome.tabs.reload(tab.id)
    
    cb()
}

const getCurrentTab = async (): Promise<chrome.tabs.Tab | undefined> => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);

    return tab;
}

const fetchWords = (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        fetch(CENSORED)
            .then((response) => response.json())
            .then((json) => {
                resolve(json.words)
            })
            .catch(reason => {
                reject(reason)
            })
    })
}

fetchWords().then(words => {
    censoredWords = words
})

chrome.action.setPopup({ popup: 'popup.html' })

chrome.action.onClicked.addListener(function (tab) {
    // @ts-ignore: Unreachable code error
    chrome.action.openPopup({ tabId: tab.id })
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (!sender) {
        return
    }
    
    switch (message) {
        case 'enable':
            enableRule(() => {
                sendResponse(1)
            })
            break;

        case 'disable':
            disableRule(() => {
                sendResponse(1)
            })
            break;

        case 'reload':
            reloadActiveTab(() => {
                sendResponse(1)
            })
            break;

        case 'is-enabled':
            chrome.declarativeNetRequest.getEnabledRulesets(rulesetIds => {
                sendResponse({ enabled: rulesetIds.length > 0 })
            })
            break;

        case 'what-to-censor':
            chrome.declarativeNetRequest.getEnabledRulesets(rulesetIds => {
                // disabled
                if (rulesetIds.length === 0) {
                    sendResponse({ words: [] })
                }

                if (censoredWords) {
                    sendResponse({ words: censoredWords })
                }

                fetchWords().then(words => {
                    censoredWords = words

                    sendResponse({ words: censoredWords })
                })
            })
            break;
    
        default:
            sendResponse(1)
            break;
    }

    return true
})
