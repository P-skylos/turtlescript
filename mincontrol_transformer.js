const DIR_ANGLE = new Map()
DIR_ANGLE.set("forward", 0)
DIR_ANGLE.set("backward", 180)
DIR_ANGLE.set("right", 90)
DIR_ANGLE.set("left", -90)

const DIR_ED =new Map([])

function compile(ast){
    switch(ast.type){
    case("block"):
        let block = "";
        for (let i = 0; i < ast.list.length; i++) {
           block = block.concat(compile(ast.list[i])+'\n') 
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
    case("do"):
        console.log(ast);
        
        return `${ast.proc}()`
        break
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
    lines = body.split("\n")
    for (let i = 0; i < lines.length; i++) {
        lines[i] = `\t${lines[i]}`
    }
    console.log(lines);
    
    return `${def_string}\n${lines.join('\n')}`     
}

function transform(ast){

}
exports.transform = transform

exports.compile = compile