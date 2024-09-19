        //TODO gotos and comments
        program = nl* B:block{return B}

        block "block"
            = statements:(s:statement nl+{return s})* {return {type:"block", list:statements}}

        statement "statement"
            = nav
            / control

        control "flow control"
            = L:label _*':' _* nl+ B:block 'stop' {return {type:"def", label:L, body:B}}
            / L:label _* ':' _* M:math {return {type:"assign", label:L, val:M}}
            / if
            / repeat
            / 'do' _* L:label {return {type:"do", proc:L}}

        if "if"
            = 'if' _* M:math _* 'do'_* S:statement{return{type:'if',condition:M, body:S}}
            / 'if' _* M:math _* 'do'_* L:label{return {type:"if", condition:M, body:{type:'do', proc:L}}}

        repeat "loop"
            = 'do' _* L:label _* 'until' _* M:math{return {type:"until", body:{type:"do", proc:L}, condition:M}}
            / 'do' _* L:label _* M:math _* 'times'{return {type:"repeat", body:{type:"do", proc:L}, times:M}}

        nav "navigation"
            = 'go' _* D:direction _* M:math {return {type:"go", direction:D, duration:M}}
            / 'spin' _* D:direction _* M:math {return {type:"spin", direction:D, duration:M}}

        direction "direction"
            = $'left'   
            / $'forward'
            / $'right'              
            / $'backward'

        math "math"
            = exponential

        exponential "exponentiation"
            = L:fractional "^" R:exponential {return {type:"math", op:"pow", left:L, right:R}}
            / V:fractional {return V}

        fractional "division"
            = L:multiplicative "/" R:fractional {return {type:"math", op:"div", left:L, right:R}}
            / V:multiplicative  {return V}                  

        multiplicative "multiplication"
            = L:additive "*" R:multiplicative {return {type:"math", op:"mult", left:L, right:R}}
            / V:additive {return V}

        additive "addition"
            = L:subtractive "+" R:additive {return {type:"math", op:"add", left:L, right:R}}
            / V:subtractive {return V}

        subtractive "subtraction"
            = L:greater "-" R:subtractive {return {type:"math", op:"minus", left:L, right:R}}
            / V:greater {return V}

        greater "greater than"
            = L: lesser ">" R:greater {return {type:"math", op:"gt", left:L, right:R}}
            / V: lesser {return V}

        lesser "less than"
            = L: equal "<" R:lesser {return {type:"math", op:"lt", left:L, right:R}}
            / V: equal {return V}

        equal "equality"
            = L: primary "=" R:equal {return {type:"math", op:"eq", left:L, right:R}}
            / V:primary {return V}

        primary "number or variable"
            = N:number {return {type:"number", val: N}}
            / L:label {return {type:"look up", label:L}}
            / "("M:math")"{return M}

        number "number"= float/int

        int
            = I:[0-9]+{return Number(I.join(''))}

        float 
            = F:([0-9]+"."[0-9]+){return Number(F.join(''))}

        label
            = $([a-zA-Z][a-zA-Z0-9_]*) //we can mangle names by starting with _ since the regex doesnt allow that

        nl = _* [\n\r;] _*
        _ = [\t ]
        ws = [\n\r\t ]