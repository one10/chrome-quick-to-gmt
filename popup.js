// https://github.com/one10/chrome-quick-to-gmt

function loadScript(scriptName) {
    var scriptEl = document.createElement('script');
    scriptEl.src = chrome.extension.getURL(scriptName);
    document.head.appendChild(scriptEl);
}

function formatDate(inp) {
    // Wed Dec 30 2015 00:08:00 GMT
    // 00:08:00 GMT, Wed Dec 30 2015
    return inp.toString('HH:mm:ss ddd MMM dd yyyy');
}

function convertDate(e) {
    loadScript('lib/date.js');

    dStr = document.querySelector('#datebox').value;
    d = Date.parse(dStr);

    if (!d) {
        document.querySelector('#out').innerHTML = '<span style="color: green; ">Orig date:</span> ' + dStr + '<hr><br><br>';
        return;
    }

    // first, treat this date as Pacific. Then convert to GMT
    offset = 8;
    if (Date.today().isDaylightSavingTime()) {
        offset = 7;
    }
    localTz = 'PST';
    if (Date.today().isDaylightSavingTime()) {
        localTz = 'PDT';
    }
    dG = formatDate(d.addHours(offset)) + ' GMT';
    dP = formatDate(d.addHours(-offset * 2)) + ' ' + localTz;


    document.querySelector('#out').innerHTML =
        '<span style="color: green; ">Orig date:</span> ' + formatDate(d.addHours(offset))
        + '<hr><span style="color: green; ">' + localTz + " > GMT:</span> " + dG
        + '<br><span style="color: green; ">GMT > ' + localTz + "</span>: " + dP;
}

// action for the extension popup form
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('datebox').addEventListener('input', convertDate);
});

