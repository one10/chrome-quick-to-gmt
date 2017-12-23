// https://github.com/one10/chrome-quick-to-gmt

/* global describe, it */
/* global formatDate, convertDate  */

const assert = require('assert');
const moment = require('moment');
const fs = require('fs');

// this is strictly for test, eval is ok
eval(fs.readFileSync('./popup.js', 'utf8')); // eslint-disable-line no-eval
eval(fs.readFileSync('./lib/date.js', 'utf8')); // eslint-disable-line no-eval

describe('formatDate(inp)', function () {
    it('should return string in (momentjs) format "HH:mm:ss ddd MMM DD YYYY" given a proper date', function () {
        const testDate1 = Date.parse('Wed Dec 30 2015 00:08:00 GMT');
        // by defaut, formatDate will return a local date, so need to adjust it to make sure we get GMT back to compare
        const offset = testDate1.getTimezoneOffset();
        assert.equal(formatDate(new Date(testDate1).addMinutes(offset)), '00:08:00 Wed Dec 30 2015');
    });
});

describe('formatDate(inp)', function () {
    it('should use (momentjs) format "HH:mm:ss ddd MMM DD YYYY" as its output', function () {
        const testDate1 = Date.parse('Wed Dec 30 2015 00:08:00 GMT');
        const offset = testDate1.getTimezoneOffset();
        assert.ok(moment(formatDate(new Date(testDate1).addMinutes(offset)), 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
    });
});

describe('convertDate(dateStr)', function () {
    it('should return properly converted values for input "tomorrow"', function () {
        const localTomorrowStart = moment().add(1, 'days').startOf('day').toDate();
        const res1 = convertDate('tomorrow');
        const offset = localTomorrowStart.getTimezoneOffset();

        // originalDate, gmtDate, localDate
        // 0: Orig date: 00:00:00 Sun Oct 08 2017
        // 1: PDT > GMT: 07:00:00 Sun Oct 08 2017 GMT
        // 2: GMT > PDT: 17:00:00 Sat Oct 07 2017 PDT
        assert.equal(res1[0], formatDate(localTomorrowStart));
        assert.equal(res1[1], formatDate(new Date(localTomorrowStart).addMinutes(offset)));
        assert.equal(res1[2], formatDate(new Date(localTomorrowStart).addMinutes(-offset)));
    });
});

describe('convertDate(dateStr)', function () {
    it('should return properly converted values for input "yesterday"', function () {
        const localYesterdayStart = moment().subtract(1, 'days').startOf('day').toDate();
        const res1 = convertDate('yesterday');
        const offset = localYesterdayStart.getTimezoneOffset();

        // originalDate, gmtDate, localDate
        assert.equal(res1[0], formatDate(localYesterdayStart));
        assert.equal(res1[1], formatDate(new Date(localYesterdayStart).addMinutes(offset)));
        assert.equal(res1[2], formatDate(new Date(localYesterdayStart).addMinutes(-offset)));
    });
});

describe('convertDate(dateStr)', function () {
    it('for valid input should produce (momentjs) format "HH:mm:ss ddd MMM DD YYYY" as its output', function () {
        const res1 = convertDate('Wed Dec 30 2015 00:08:00');
        assert.ok(moment(res1[0], 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
        assert.ok(moment(res1[1], 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
        assert.ok(moment(res1[2], 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
    });
});

describe('convertDate(dateStr)', function () {
    it('for valid input should produce (momentjs) format "HH:mm:ss ddd MMM DD YYYY" as its output', function () {
        const res1 = convertDate('Wed Dec 30 clearly some garbage here 2015 00:08:00 GMT');
        assert.equal(res1, null);
    });
});
