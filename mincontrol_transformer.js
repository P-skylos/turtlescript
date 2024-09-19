const DIR_ANGLE = new Map()
DIR_ANGLE.set("forward", 0)
DIR_ANGLE.set("backward", 180)
DIR_ANGLE.set("right", 90)
DIR_ANGLE.set("left", -90)

const DIR_ED =new Map([])

function compile_with_checks(ast){
    const symtable =  new Map()
    try{
    reference_check(ast, symtable)
    }catch(e){
        console.log(e)
        return e.message
    }
    //make a name generator
    const counter = new Name_counter("_")
    console.log(counter.new_name())
    return compile(ast, counter)
}

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

function reference_check(ast, table){ //table is an empty map object
    switch(ast.type){
        case("block"):
            for (let i = 0; i < ast.list.length; i++) {
                reference_check(ast.list[i], table)
            }
            break
        case("go"):
            check_math(ast.duration, table)
            break
        case("spin"):
            check_math(ast.duration)
            break
        case("def"):
            table.set(ast.label, "proc")
            reference_check(ast.body, table)
            break
        case("assign"):
            table.set(ast.label, "num")
            break
        case("do"):
            if(table.has(ast.proc)){
                if(table.get(ast.proc)!=="proc"){
                    throw new Error(`"${ast.proc}" is a(n) "${table.get(ast.proc)}" not a procedure`);
                }
            }else{
            throw new Error(`NAME "${ast.proc}" DOES NOT EXIST`)
            }
            break
        case("math"):
            reference_check(ast.left, table)
            reference_check(ast.right, table)
            break
        case("number"):
            break
        case("look up"):
            if(!table.has(ast.label)){
                throw new Error(`NAME "${ast.label}" DOES NOT EXIST`);
            }
            break
        case("if"):
            check_math(ast.condition, table)
            reference_check(ast.body, table)
            break
        case("until"):
            check_math(ast.condition, table)
            reference_check(ast.body, table)
            break
        case("repeat"):
            check_math(ast.times, table)
            reference_check(ast.body, table)
            break
        }
    return table
}

function check_math(ast,table){
    if (ast.type === "lookup"){
        if(table.has(ast.label)){
            if (table.get(ast.label)!=="num"){
                throw new Error(`label ${ast.label} is of type ${table.get(ast.label)} when a number was expected`)
            }
        }else{
        throw new Error(`NAME ${ast.label} DOES NOT EXIST`);
        }
        return
    }  
    if (ast.type == "number"){return}
    check_math(ast.left, table)
    check_math(ast.right, table)
    
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

function transform(ast){

}
exports.transform = transform

exports.compile = compile