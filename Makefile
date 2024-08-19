run: parser.js
	node main.js

math.js: parser.peggy
	npx peggy parser.peggy