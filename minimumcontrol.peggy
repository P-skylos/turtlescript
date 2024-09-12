//TODO gotos and comments
program = nl* B:block{return B}

block
    = statements:(s:statement nl+{return s})* {return {type:"block", list:statements}}

statement
    = nav
    / control

control
    = L:label _*':' _* nl+ B:block 'stop' {return {type:"def", label:L, body:B}}
    / L:label _* ':' _* M:math {return {type:"assign", label:L, val:M}}
    / 'do' _* L:label {return {type:"do", proc:L}}

nav
    = 'go' _* D:direction _* I:int {return {type:"go", direction:D, duration:I}}
    / 'spin' _* D:direction _* I:int {return {type:"spin", direction:D, duration:I}}

direction
    = $'left'   
    / $'forward'
    / $'right'
    / $'backward'

math
    = exponential

exponential
    = L:fractional "^" R:exponential {return {type:"math", op:"pow", left:L, right:R}}
    / V:fractional {return V}

fractional
    = L:multiplicative "/" R:fractional {return {type:"math", op:"div", left:L, right:R}}
    / V:multiplicative  {return V}                  

multiplicative
    = L:additive "*" R:multiplicative {return {type:"math", op:"mult", left:L, right:R}}
    / V:additive {return V}

additive
    = L:subtractive "+" R:additive {return {type:"math", op:"add", left:L, right:R}}
    / V:subtractive {return V}

subtractive
    = L:primary "-" R:subtractive {return {type:"math", op:"minus", left:L, right:R}}
    / V:primary {return V}

primary
    = N:number {return {type:"number", val: N}}
    / L:label {return {type:"look up", label:L}}

number = float/int

int
    = I:[0-9]+{return Number(I.join(''))}

float 
    = F:([0-9]+"."[0-9]+){return Number(F.join(''))}

label
    = $([a-zA-Z]+[a-zA-Z0-9]*)

nl = _* [\n\r;] _*
_ = [\t ]
ws = [\n\r\t ]