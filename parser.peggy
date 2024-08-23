{{}}
statements
    = _* statement _* nl+ _* statements _*
    / _* statement _*
    / [\n\t\r ]*''

statement
    = assign
    / expression
    / if
    / repeat
//    / start
//    / until

assign
    = name _*':'_* params block
    / name _*':'_* expression

expression
    = math
//    / list
 //   / index
    / lookup
    / call

repeat
    = 'repeat' _+ 'until'_+ expression nl* block
    / 'repeat' _+ 'forever' nl* block

if
    = 'if' _+ expression block 'else' block
    / 'if' _+ expression block 

lookup
    = name

call
	= name _+ args

args
	= arg _+ args
    / arg
    / _*''

arg 
    = expression

params
	= name _+ params
    / name
    / ''

block 
    = '{' nl statements nl '}'

math
    = exponential

exponential
    = L:fractional "^" R:exponential {return Math.pow(L, R)}
    / V:fractional {return V}

fractional
    = L:multiplicative "/" R:fractional {return L/R}
    / V:multiplicative  {return V}                  

multiplicative
    = L:additive "*" R:multiplicative {return L*R}
    / V:additive {return V}

additive
    = L:subtractive "+" R:additive {return L+R}
    / V:subtractive {return V}

subtractive
    = L:primary "-" R:subtractive {return L-R}
    / V:primary {return V}

primary
    = N:number {return N}
    / "("E:expression")" {return E}

number 
    = int:[0-9]+!"." {return Number(int)}
    / float:([0-9]+ "." [0-9]+) {return Number(float.join(''))}

name
    = $([_a-zA-Z][_a-zA-Z0-9]*) //returns matched text
_
    = [\t ]

nl "newline"
    = [\n\r]