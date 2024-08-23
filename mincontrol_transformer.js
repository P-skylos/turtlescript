const DIR_ANGLE = new Map()
DIR_ANGLE.set("forward", 0)
DIR_ANGLE.set("backward", 180)
DIR_ANGLE.set("right", 90)
DIR_ANGLE.set("left", -90)

function compile(ast){
    switch(ast.type){
    case("sequence"):
        s1 = compile(ast.left)
        s2 = compile(ast.right)
        return `${s1}\n${s2}`
        break
    case("go"):
        drive = `Ed.Drive()`
    case("spin"):
        return compile_spin(ast)
    }
}

function compile_spin(ast){
    angle = ast.duration
    switch(ast.direction){
        case("left"):
            break
        case("right"):
            break
        default:
            break
    }
}


function transform(ast){

}
exports.transform = transform

export.compile = compile