# Super-Quick Timezone Conversions and Lookups in Chrome

A Chrome extension that converts the current time (now) or any pasted parseable time/date to GMT/UTC and back  - for 
quick lookups, logs and server time conversions.

If you work with GMT, UTC, Greenwich, UK time a lot - this often comes up in devops or system administration or AWS or 
database logs work - you get to incessantly convert between the local time, which is what most normal humans understand, 
and timestamps, and UTC and back. This simple extension helps automate quick lookups and time conversions. 

Notes:
* `node`, `npm` and `Makefile` are only for dev/testing convenience, not required for the actual extension.
* `moment` 2.22.2 and `date` 1.0-alpha-1 libraries come bundled and minified with a fixed version since Chrome seems 
to only support plain javascript.
* this Chrome extension will try to tell between epoch milliseconds or seconds given, but that's not always possible.
* if you type `now`, you'll get the current local time

# Installation
Clone this git project into some local folder, go to chrome://extensions/ in Chrome, enable developer extensions, then 
hit "Load unpacked extension" and point it to the project folder. You will see a red clock icon added to the right of 
the Chrome address bar.

# Running tests
`npm test`


# Todo
* Move out node and npm stuff out of the actual extension code
* If we use momentjs in the main code (not just in tests), we can possibly parse more formats - test
* Add unit tests to ensure updateDocCallback is called with the proper values for different inputs
* Output only the short version of the timezone. "America/Los_Angeles" looks really human-hostile compared to "PST"
