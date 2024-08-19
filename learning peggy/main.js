parser=require("./math.js")
eqs = ["1+2", "1+2-2", "2*7", "(2+4)*5", "1.2"]
eqs.forEach(eq => {
    console.log(eq)
    console.log(parser.parse(eq))
    
});