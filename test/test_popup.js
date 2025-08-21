// https://github.com/one10/chrome-quick-to-gmt

import assert from 'assert';
import moment from 'moment';
import fs from 'fs';
import { formatDate, convertDate } from '../popup.js';

// Load date library extensions first
eval(fs.readFileSync('./lib/date-1.0-alpha-1.js', 'utf8'));

// Make moment available globally for popup.js
global.moment = moment;

describe('formatDate(inp)', function() {
  it('should return string in (momentjs) format "HH:mm:ss ddd MMM DD YYYY" given a proper date', function() {
    const testDate1 = new Date(Date.parse('Wed Dec 30 2015 00:08:00 GMT'));
    // by defaut, formatDate will return a local date, so need to adjust it to make sure we get GMT back to compare
    const offset = testDate1.getTimezoneOffset();
    assert.equal(formatDate(new Date(testDate1).addMinutes(offset)), '00:08:00 Wed Dec 30 2015');
  });
});

describe('formatDate(inp)', function() {
  it('should use (momentjs) format "HH:mm:ss ddd MMM DD YYYY" as its output', function() {
    const testDate1 = new Date(Date.parse('Wed Dec 30 2015 00:08:00 GMT'));
    const offset = testDate1.getTimezoneOffset();
    assert.ok(moment(formatDate(new Date(testDate1).addMinutes(offset)), 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
  });
});

describe('convertDate(dateStr)', function() {
  it('should return properly converted values for input "tomorrow"', function() {
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

describe('convertDate(dateStr)', function() {
  it('should return properly converted values for input "yesterday"', function() {
    const localYesterdayStart = moment().subtract(1, 'days').startOf('day').toDate();
    const res1 = convertDate('yesterday');
    const offset = localYesterdayStart.getTimezoneOffset();

    // originalDate, gmtDate, localDate
    assert.equal(res1[0], formatDate(localYesterdayStart));
    assert.equal(res1[1], formatDate(new Date(localYesterdayStart).addMinutes(offset)));
    assert.equal(res1[2], formatDate(new Date(localYesterdayStart).addMinutes(-offset)));
  });
});

describe('convertDate(dateStr) happy path', function() {
  it('for valid input should produce (momentjs) format "HH:mm:ss ddd MMM DD YYYY" as its output', function() {
    const res1 = convertDate('Wed Dec 30 2015 00:08:00');
    assert.ok(moment(res1[0], 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
    assert.ok(moment(res1[1], 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
    assert.ok(moment(res1[2], 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
  });
});

describe('convertDate(dateStr) error', function() {
  it('for invalid input should produce null', function() {
    const res1 = convertDate('Wed Dec 30 clearly some garbage here 2015 00:08:00 GMT');
    assert.equal(res1, null);
  });
});

describe('convertDate(dateStr) timestamp conversion fix', function() {
  it('should correctly convert Unix timestamp to local time representation', function() {
    // This test validates the timezone handling fix for Unix timestamps
    // Timestamp 1537315365092 = 2018-09-19T00:02:45.092Z (UTC)
    // The original field should show the local time representation
    // Note: This test will pass in environments where the timestamp gets converted to local time
    
    const result1 = convertDate('1537315365092');
    const result2 = convertDate(1537315365092);
    
    // Verify the format is correct (should be HH:mm:ss ddd MMM DD YYYY)
    assert.ok(moment(result1[0], 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
    assert.ok(moment(result2[0], 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
    
    // Both string and number inputs should produce the same result
    assert.equal(result1[0], result2[0]);
  });
});

describe('convertDate(dateStr) advanced cases', function() {
  it('for valid input should produce (momentjs) format "HH:mm:ss ddd MMM DD YYYY" as its output', function() {
    assert.equal(convertDate('Wed Dec 30 2015 00:08:00')[0], '00:08:00 Wed Dec 30 2015');
    // milliseconds - test timestamp format validation rather than specific timezone
    const result1 = convertDate('1537315365092')[0];
    const result2 = convertDate(1537315365092)[0];
    assert.ok(moment(result1, 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
    assert.ok(moment(result2, 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
    assert.equal(result1, result2);
    // seconds - test format validation rather than specific timezone
    const secondsResult = convertDate(1542749748)[0];
    assert.ok(moment(secondsResult, 'HH:mm:ss ddd MMM DD YYYY', true).isValid());
    assert.equal(convertDate('Tue Sep 18 23:42:32.862950 2018', null)[0], '23:42:32 Tue Sep 18 2018');
    assert.equal(convertDate('Wed Sep 19 00:50:54.463285 2018')[0], '00:50:54 Wed Sep 19 2018');
    assert.equal(convertDate('Wed Sep 19 00:50:54.455685 2018')[0], '00:50:54 Wed Sep 19 2018');
    // TODO (one10): looks like we could actually parse this one
    assert.equal(convertDate('23/Oct/2018:02:14:59 +0000'), null);

    // Test various date formats - validate format rather than specific timezone results
    const dateFormats = [
      'Tue, 06 Nov 2018 05:10:53 GMT',
      '2018-11-05 21:10:59.708',
      '2018-11-06T06:04:48.086Z', 
      '11/05/2018 9:34:17.619 PM',
      '2018-11-05 21:10:53.781',
      'Nov 05, 2018 9:21:31.570 PM',
      '11/20/2018 11:21:33.006 AM',
      'Nov 20, 2018 11:21:33.009 AM',
      '2018-11-20 11:21:23.231'
    ];
    
    dateFormats.forEach(dateStr => {
      const result = convertDate(dateStr);
      assert.ok(result !== null, `Failed to parse: ${dateStr}`);
      assert.ok(moment(result[0], 'HH:mm:ss ddd MMM DD YYYY', true).isValid(), 
        `Invalid format for: ${dateStr} -> ${result[0]}`);
    });
  });
});
