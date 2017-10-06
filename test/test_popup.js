// https://github.com/one10/chrome-quick-to-gmt

/* global describe, it */

const assert = require('assert');
const popup = require('../popup.js');
require('../lib/date.js');

describe('formatDate(inp)', function () {
    it('should retugrn string in format "HH:mm:ss ddd MMM dd yyyy" given a proper date', function () {
        const testDate1 = Date.parse('Wed Dec 30 2015 00:08:00 GMT');
        // by defaut, formatDate will return a local date, so need to adjust it to make sure we get GMT back to compare
        const offset = testDate1.getTimezoneOffset() / 60;
        assert.equal(popup.formatDate(testDate1.addHours(offset)), '00:08:00 Wed Dec 30 2015');
    });
});
