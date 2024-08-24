program
    = statements

statements
    = S1:statement nl+ S2:statements {return {type:"sequence", left:S1, right:S2}}
    / S:statement {return S}
    / ''

statement
    = nav

nav
    = 'go' _ D:direction _ I:int {return {type:"go", direction:D, duration:I}}
    / 'spin' _ D:direction _ I:int {return {type:"spin", direction:D, duration:I}}

direction
    = $'left'
    / $'forward'
    / $'right'
    / $'backward'

int
    = I:[0-9]+{return Number(I.join(''))}

nl = _* [\n\r;] _*
_ = [\t ]
ws = [\n\r\t ]