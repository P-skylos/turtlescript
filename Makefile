run: parser.js 
	node main.js

test-min: minimumcontrol.js 
	node testminimumcontrol.js

%.js: %.peggy
	npx peggy $<