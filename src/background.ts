const SHALLTY_WEB = 'https://shallty.moe/';

const clickHandler = function (info: chrome.contextMenus.OnClickData) {
    let url = info.pageUrl;

    if (info.linkUrl) {
        url = info.linkUrl;
    }

    chrome.tabs.create({ 'url': `${SHALLTY_WEB}?shortlink=${encodeURIComponent(url)}&open_in_new_tab=false` });
}

const onRuleMatchedDebug = (info: chrome.declarativeNetRequest.MatchedRuleInfoDebug) => {
    console.log('onRuleMatchedDebug', info)
}

const createContextMenusCallback = function () {
    console.log('Context created');
}

const bypass = chrome.contextMenus.create({
    'id': 'bypass_shortlink',
    'title': 'Tes Context',
    'contexts': ['link'],
}, createContextMenusCallback);

chrome.contextMenus.onClicked.addListener(clickHandler);

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(onRuleMatchedDebug)

chrome.declarativeNetRequest.getAvailableStaticRuleCount(count => {
    console.log('getAvailableStaticRuleCount: ', count)
})

chrome.declarativeNetRequest.getEnabledRulesets(rulesetIds => {
    console.log('getEnabledRulesets', rulesetIds)
})

chrome.declarativeNetRequest.isRegexSupported(
    {
        isCaseSensitive: false,
        regex: "(https?:\/\/.*\\.(?:png|jpg)).*"
    },
    (result: chrome.declarativeNetRequest.IsRegexSupportedResult) => {
        console.log(result)
    }
)

// @ts-ignore: Unreachable code error
// chrome.declarativeNetRequest.testMatchOutcome(
//     {
//         type: "main_frame",
//         url: "https://i.imgur.com/ot48acb.jpg&w=1920&q=75"
//     },
//     (matchedRule: chrome.declarativeNetRequest.MatchedRule) => {
//         console.log('testMatchOutcome', matchedRule)
//     }
// )

// @ts-ignore: Unreachable code error
// chrome.declarativeNetRequest.testMatchOutcome(
//     {
//         type: "image",
//         url: "https://i.imgur.com/ot48acb.jpg&w=1920&q=75"
//     },
//     (matchedRule: chrome.declarativeNetRequest.MatchedRule) => {
//         console.log('testMatchOutcome2', matchedRule)
//     }
// )
