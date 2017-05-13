// https://github.com/one10/chrome-quick-to-gmt

function loadScript(scriptName) {
    var scriptEl = document.createElement('script');
    scriptEl.src = chrome.extension.getURL(scriptName);
    document.head.appendChild(scriptEl);
}

function convertDate(e) {
    loadScript('lib/date.js');

    dStr = document.querySelector('#datebox').value;
    d = Date.parse('today');

    document.querySelector('#out').innerHTML = '<span style="color: green; ">PST > GMT:</span> ' + d
        + '<br><span style="color: green; ">GMT > PST</span>: ' + d;
}

// action for the extension popup form
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('datebox').addEventListener('input', convertDate);
});

