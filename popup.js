// https://github.com/one10/chrome-quick-to-gmt

function loadScript(scriptName) {
    const scriptEl = document.createElement('script');
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

    const dStr = document.querySelector('#datebox').value;
    const d = Date.parse(dStr);

    if (!d) {
        document.querySelector('#out').innerHTML = `<span style="color: green; ">Orig date:</span> ${dStr} <hr><br><br>`;
        return;
    }

    // first, treat this date as Pacific. Then convert to GMT
    const offset = (Date.today().isDaylightSavingTime()) ? 7 : 8;
    const localTz = (Date.today().isDaylightSavingTime()) ? 'PDT' : 'PST';

    const dG = `${formatDate(d.addHours(offset))}  GMT`;
    const dP = `${formatDate(d.addHours(-offset * 2))} ${localTz}`;

    document.querySelector('#out').innerHTML =
        `<span style="color: green; ">Orig date:</span> ${formatDate(d.addHours(offset))} <hr>
        <span style="color: green; "> ${localTz} > GMT:</span> ${dG} <br>
        <span style="color: green; ">GMT > ${localTz}</span>: ${dP}`;
}

// action for the extension popup form
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('datebox').addEventListener('input', convertDate);
});

