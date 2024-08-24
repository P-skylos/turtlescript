parser = require("./parser.js")
tests = ["x:1"]
tests.forEach(test => {
    console.log(test)
    console.log(parser.parse(test))
});


