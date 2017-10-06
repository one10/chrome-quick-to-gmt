// https://github.com/one10/chrome-quick-to-gmt

function loadScript(scriptName) {
    const scriptEl = document.createElement('script');
    scriptEl.src = chrome.extension.getURL(scriptName);
    document.head.appendChild(scriptEl);
}

// given a date, e.g.: Date.parse('Wed Dec 30 2015 00:08:00 GMT')
// output a string, e.g.: '00:08:00 Wed Dec 30 2015'
function formatDate(inp) {
    return inp.toString('HH:mm:ss ddd MMM dd yyyy');
}

// given a date string in any parseable format
// return an array: [originalDate, gmtDate, localDate]
function convertDate(dateStr) {
    const inpDate = Date.parse(dateStr);
    if (!inpDate) {
        return null;
    }
    // first, treat this date as Pacific. Then convert to GMT
    const offset = (Date.today().isDaylightSavingTime()) ? 7 : 8;

    const originalDate = formatDate(new Date(inpDate.getTime()));
    const gmtDate = formatDate(new Date(inpDate.getTime()).addHours(offset));
    const localDate = formatDate(new Date(inpDate.getTime()).addHours(-offset));

    return [originalDate, gmtDate, localDate];
}

function prepConvertDate() {
    loadScript('lib/date.js');

    const dateStr = document.querySelector('#datebox').value;
    const conversionResults = convertDate(dateStr);

    if (!conversionResults) {
        document.querySelector('#out').innerHTML = `<span style="color: green;">Orig date:</span>${dateStr}<hr><br><br>`;
        return;
    }

    const localTz = (Date.today().isDaylightSavingTime()) ? 'PDT' : 'PST';
    document.querySelector('#out').innerHTML =
        `<span style="color: green; ">Orig date:</span> ${conversionResults[0]} <hr>
        <span style="color: green; "> ${localTz} > GMT:</span> ${conversionResults[1]} GMT <br>
        <span style="color: green; ">GMT > ${localTz}</span>: ${conversionResults[2]} ${localTz}`;
}

// action for the extension popup form
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById('datebox').addEventListener('input', prepConvertDate);
    });
}

module.exports = {
    formatDate,
    convertDate
};
