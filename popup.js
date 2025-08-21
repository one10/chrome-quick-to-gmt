// https://github.com/one10/chrome-quick-to-gmt

// given a date, e.g.: Date.parse('Wed Dec 30 2015 00:08:00 GMT')
// output a string, e.g.: '00:08:00 Wed Dec 30 2015'
function formatDate(inp) {
  const hours = inp.getHours().toString().padStart(2, '0');
  const minutes = inp.getMinutes().toString().padStart(2, '0');
  const seconds = inp.getSeconds().toString().padStart(2, '0');
  const weekday = inp.toLocaleDateString('en-US', { weekday: 'short' });
  const month = inp.toLocaleDateString('en-US', { month: 'short' });
  const day = inp.getDate().toString().padStart(2, '0');
  const year = inp.getFullYear();

  return `${hours}:${minutes}:${seconds} ${weekday} ${month} ${day} ${year}`;
}

// given a date string in any parseable format
// return an array: [originalDate, gmtDate, localDate]
function convertDate(input) {
  // Check if input is a timestamp first, before Date.parse
  const isTimestamp = /^\d+$/.test(input) || Number.isInteger(input);
  let inpDate;
  
  if (isTimestamp) {
    try {
      let timestamp = parseInt(input, 10);
      // Note: this will be invalid if we are passed a legitimate low value of milliseconds, or a high number of secs.
      if (timestamp < 9999999999) {
        timestamp *= 1000;
      }
      inpDate = new Date(timestamp);
    } catch (e) {
      return null;
    }
  } else {
    inpDate = Date.parse(input);
    if (!inpDate) {
      try {
        // we can't pass a date format string, because we don't know what it is! hence the suppression.
        moment.suppressDeprecationWarnings = true;
        const m = moment(input);
        if (!m.isValid()) {
          return null;
        }
        inpDate = m.toDate();
      } catch (e) {
        return null;
      }
    }
  }

  if (!inpDate) {
    return null;
  }

  const originalDateVal = new Date(inpDate);
  
  // For Unix timestamps, the date represents UTC time, 
  // but we want to show it as local time in the original field
  if (isTimestamp) {
    const originalDate = formatDate(originalDateVal);  // Show as local time
    const offset = originalDateVal.getTimezoneOffset();
    const gmtDate = formatDate(new Date(originalDateVal.getTime() + offset * 60000));  // Convert to GMT display
    const localDate = formatDate(new Date(originalDateVal.getTime() - offset * 60000));  // Convert to local display
    return [originalDate, gmtDate, localDate];
  }
  
  // For other date formats, treat as local time and convert
  const offset = originalDateVal.getTimezoneOffset();
  const originalDate = formatDate(originalDateVal);
  const gmtDate = formatDate(new Date(originalDateVal.getTime() + offset * 60000));
  const localDate = formatDate(new Date(originalDateVal.getTime() - offset * 60000));

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

export { formatDate, convertDate, loadScript, updateDocument, prepConvertDate };
