// https://github.com/one10/chrome-quick-to-gmt

// given a date, e.g.: Date.parse('Wed Dec 30 2015 00:08:00 GMT')
// output a string, e.g.: '00:08:00 Wed Dec 30 2015'
function formatDate(inp) {
  return inp.toString('HH:mm:ss ddd MMM dd yyyy');
}

// given a date string in any parseable format
// return an array: [originalDate, gmtDate, localDate]
function convertDate(input) {
  let inpDate = Date.parse(input);
  if (!inpDate) {
    try {
      const isTimestamp = /^\d+$/.test(input) || Number.isInteger(input);
      if (isTimestamp) {
        let timestamp = parseInt(input, 10);

        // Note: this will be invalid if we are passed a legitimate low value of milliseconds, or a high number of secs.
        if (timestamp < 9999999999) {
          timestamp *= 1000;
        }

        inpDate = new Date(timestamp);
      } else {
        // we can't pass a date format string, because we don't know what it is! hence the suppression.
        moment.suppressDeprecationWarnings = true;
        const m = moment(input);
        if (!m.isValid()) {
          return null;
        }
        inpDate = m.toDate();
      }
    } catch (e) {
      return null;
    }
  }

  if (!inpDate) {
    return null;
  }
  // first, treat this date as local. Then convert to GMT
  const offset = Date.today()
    .getTimezoneOffset();

  const originalDate = formatDate(new Date(inpDate.getTime()));
  const gmtDate = formatDate(new Date(inpDate.getTime()).addMinutes(offset));
  const localDate = formatDate(new Date(inpDate.getTime()).addMinutes(-offset));

  return [originalDate, gmtDate, localDate];
}

function loadScript(scriptName) {
  const scriptEl = document.createElement('script');
  scriptEl.src = chrome.runtime.getURL(scriptName);
  document.head.appendChild(scriptEl);
}

function updateDocument(origDate, localToGmtResult = '', gmtToLocalResult = '', localTz = '', gmt = '') {
  document.querySelector('#origDate').innerHTML = origDate;
  document.querySelector('#localToGmtResult').innerHTML = localToGmtResult;
  document.querySelector('#gmtToLocalResult').innerHTML = gmtToLocalResult;
  document.querySelector('#localTz').innerHTML = localTz;
  document.querySelector('#gmt').innerHTML = gmt;
}

function prepConvertDate(event, updateDocCallback = updateDocument) {
  loadScript('lib/date-1.0-alpha-1.js');
  loadScript('lib/moment-2.22.2.min.js');

  const dateStr = document.querySelector('#datebox').value;
  const convRes = convertDate(dateStr);

  if (!convRes) {
    updateDocCallback(dateStr, '', '', '', '');
    return;
  }
  updateDocCallback(convRes[0], convRes[1], convRes[2], Intl.DateTimeFormat()
    .resolvedOptions().timeZone, 'GMT');
}

// action for the extension popup form
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('datebox')
      .addEventListener('input', prepConvertDate);
  });
}
