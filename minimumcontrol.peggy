//TODO gotos and comments
program = nl* B:block{return B}

block
    = statements:(s:statement nl+{return s})* {return {type:"block", list:statements}}

statement
    = nav
    / control

control
    = L:label _*':' _* nl+ B:block 'stop' {return {type:"def", label:L, body:B}}
    / 'do' _* L:label {return {type:"do", proc:L}}

nav
    = 'go' _* D:direction _* I:int {return {type:"go", direction:D, duration:I}}
    / 'spin' _* D:direction _* I:int {return {type:"spin", direction:D, duration:I}}

direction
    = $'left'   
    / $'forward'
    / $'right'
    / $'backward'


int
    = I:[0-9]+{return Number(I.join(''))}

label
    = $([a-zA-Z]+[a-zA-Z0-9]*)

nl = _* [\n\r;] _*
_ = [\t ]
ws = [\n\r\t ]