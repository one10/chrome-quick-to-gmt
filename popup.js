
function loadScript(scriptName) {
    var scriptEl = document.createElement('script');
    scriptEl.src = chrome.extension.getURL(scriptName);
    document.head.appendChild(scriptEl);
}

function convertDate(e) {
    loadScript('lib/date.js');

    dStr = document.querySelector('#datebox').value;
    d = Date.parse('today');

    document.querySelector('#out').innerHTML = "<font color='green'>PST > GMT:</font> " + d 
        + "<br><font color='green'>GMT > PST</font>: " + d;
}

// action for the extension popup form
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('datebox').addEventListener('input', convertDate);
});

