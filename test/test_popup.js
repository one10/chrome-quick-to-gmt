// https://github.com/one10/chrome-quick-to-gmt

/* global describe, it */

const assert = require('assert');
const moment = require('moment');
const popup = require('../popup.js');
require('../lib/date.js');

describe('formatDate(inp)', function () {
    it('should return string in format "HH:mm:ss ddd MMM DD YYYY" given a proper date', function () {
        const testDate1 = Date.parse('Wed Dec 30 2015 00:08:00 GMT');
        // by defaut, formatDate will return a local date, so need to adjust it to make sure we get GMT back to compare
        const offset = testDate1.getTimezoneOffset();
        assert.equal(popup.formatDate(testDate1.addMinutes(offset)), '00:08:00 Wed Dec 30 2015');
    });
});

describe('formatDate(inp)', function () {
    it('should use format "HH:mm:ss ddd MMM DD YYYY" as its output', function () {
        const testDate1 = Date.parse('Wed Dec 30 2015 00:08:00 GMT');
        const offset = testDate1.getTimezoneOffset();
        assert.ok(moment(popup.formatDate(testDate1.addMinutes(offset)), 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
    });
});

describe('convertDate(dateStr)', function () {
    it('should return properly converted values for input "Mar-30 4:21 PM"', function () {
        const res1 = popup.convertDate('Mar-30 4:21 PM');
        assert.equal(res1[0], '16:21:00 Thu Mar 30 2017');
        assert.equal(res1[1], '23:21:00 Thu Mar 30 2017');
        assert.equal(res1[2], '09:21:00 Thu Mar 30 2017');
    });
});