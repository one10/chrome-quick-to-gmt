# chrome-quick-to-gmt

A Chrome extension that converts the current time (now) or any pasted parseable time/date to GMT and back - for quick lookups, logs and server time conversions.

Note: node, npm and Makefile are only for dev/testing convenience, not required for the actual extension.

# Installation
Clone this git project into some local folder, go to chrome://extensions/ in Chrome, enable developer extensions, then hit "Load unpacked extension" and point it to the project folder. You will see a red clock icon added to the right of the Chrome address bar.

# Running tests
`npm test`


# Todo
* add timestamp seconds and timestamp milliseconds conversions
* Move out node and npm stuff out of the actual extension code
* If we use momentjs in the main code (not just in tests), we can possibly parse more formats - test
* Add unit tests to ensure updateDocCallback is called with the proper values for different inputs
* Output only the short version of the timezone. "America/Los_Angeles" looks really human-hostile compared to "PST"
