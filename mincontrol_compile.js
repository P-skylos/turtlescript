


function compile(ast, counter){
    switch(ast.type){
    case("block"):
        let block = "";
        for (let i = 0; i < ast.list.length; i++) {
           block = block.concat(compile(ast.list[i], counter)+'\n') 
        }
        return  block
        break
    case("go"):
        return compile_go(ast)
        break
    case("spin"):
        return compile_spin(ast)
        break
    case("def"):
        return compile_def(ast)
        break
    case("assign"):
        return `${ast.label} = ${compile(ast.val, counter)}`
        break
    case("do"):
        return `${ast.proc}()`
        break
    case("math"):
        return compile_math(ast)
        break
    case("number"):
        return `${ast.val}`
        break
    case("look up"):
        return ast.label
        break
    case("if"):
        return `if ${compile(ast.condition, counter)}:\n\t${compile(ast.body, counter)}`
        break
    case("until"):
        return `while not (${compile(ast.condition, counter)}):\n\t${compile(ast.body, counter)}}`
        break
    case("repeat"):
        return `for i in range(${compile(ast.times, counter)}):\n\t${compile(ast.body, counter)}`
    }
}

function compile_go(ast){
    switch(ast.direction){
        case("forward"):
            return `Ed.DRIVE(Ed.FORWARD, Ed.SPEED_5, ${ast.duration})`
            break
        case("backward"):
            return `Ed.DRIVE(Ed.BACKWARD, Ed.SPEED_5, ${ast.duration})`
            break
        case("left"):
            spin = compile_spin({type:"spin", direction:"left", duration:90})
            forward = `Ed.DRIVE(Ed.FORWARD, Ed.SPEED_5, ${ast.duration})`
            return `${spin}\n${forward}`
            break
        case("right"):
            spin = compile_spin({type:"spin", direction:"right", duration:90})
            forward = `Ed.DRIVE(Ed.FORWARD, Ed.SPEED_5, ${ast.duration})`
            return `${spin}\n${forward}`
            break
    }
    throw Error("unexpected input in compile_go")
}

function compile_spin(ast){
    direction = '';
    switch(ast.direction){
        case("left"):
            direction = "Ed.SPIN_LEFT"
            break
        case("right"):
            direction = "Ed.SPIN_RIGHT"
            break
        default:
            throw new Error(`spin direction "${ast.direction}" is undefined`)
    }
    return `Ed.Drive(${direction}, Ed.SPEED_5, ${ast.duration})`
}

function compile_def(ast){
    let def_string = `def ${ast.label}():`
    let body = compile(ast.body)
    body = indent(body)
    return `${def_string}\n${body}`     
}

function indent(block){
    lines = block.split("\n")
    for (let i = 0; i < lines.length-1; i++) {
        lines[i] = `\t${lines[i]}`
    }
    return lines.join('\n')
}

function compile_math(ast){
    switch(ast.op){
        case("pow"):
        return `(${compile(ast.left)})**(${compile(ast.right)})`
        break
        case("div"):
        return `(${compile(ast.left)})/(${compile(ast.right)})`
        break
        case("mult"):
        return `(${compile(ast.left)})*(${compile(ast.right)})`
        break
        case("add"):
        return `(${compile(ast.left)})+(${compile(ast.right)})`
        break
        case("minus"):
        return `(${compile(ast.left)})-(${compile(ast.right)})`
        break
        case("gt"):
        return `(${compile(ast.left)})>(${compile(ast.right)})`
        break
        case("lt"):
        return `(${compile(ast.left)})<(${compile(ast.right)})`
        break
        case("eq"):
        return `(${compile(ast.left)})==(${compile(ast.right)})`
        break
    }

}

class Name_counter{
    prefix = "_"
    count = 0
    constructor(_prefix){
        this.prefix = _prefix
    }
    new_name(){
        this.count = this.count + 1
        return `${this.prefix}${this.count-1}`
    }
}