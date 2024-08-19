{{}}
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
    / "("E:exponential")" {return E}

number 
    = int:[0-9]+!"." {return Number(int)}
    / float:([0-9]+ "." [0-9]+) {return Number(float.join(''))}
