function compile_prelude(ast, counter){
    let ed_setup = `import Ed
Ed.EdisonVersion = Ed.V3
Ed.DistanceUnits = Ed.CM
Ed.Tempo = Ed.TEMPO_MEDIUM`
    let linetracker = "Ed.LineTrackerLed(Ed.ON)"
    let light_level = "_LIGHT_THRESHHOLD = Ed.ReadLeftLightLevel()"
    let program = compile(ast, counter)
    return `#PREAMBLE\n${ed_setup}\n#CALIBRATION\n${linetracker}\n${light_level}\n#PROGRAM\n${program}`
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
    case("wait"):
        return `Ed.TimeWait(${compile(ast.time, counter)}, Ed.TIME_SECONDS)`
        break
    case("sensor"):
        return compile_sensor(ast)
        break
    }
}

function compile_go(ast){
    switch(ast.direction){
        case("forward"):
            return `Ed.Drive(Ed.FORWARD, Ed.SPEED_5, ${compile(ast.duration)})`
            break
        case("backward"):
            return `Ed.Drive(Ed.BACKWARD, Ed.SPEED_5, ${compile(ast.duration)})`
            break
        case("left"):
            spin = compile_spin({type:"spin", direction:"left", duration:90})
            forward = `Ed.Drive(Ed.FORWARD, Ed.SPEED_5, ${compile(ast.duration)})`
            return `${spin}\n${forward}`
            break
        case("right"):
            spin = compile_spin({type:"spin", direction:"right", duration:90})
            forward = `Ed.Drive(Ed.FORWARD, Ed.SPEED_5, ${compile(ast.duration)})`
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
    return `Ed.Drive(${direction}, Ed.SPEED_5, ${compile(ast.duration)})`
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
        default:
        return compile(ast)
        break
    }
}

function compile_sensor(ast){
    switch(ast.sensor){
        case("line"):
            if (ast.color === "black"){
                return `(Ed.ReadLineState() == Ed.LINE_ON_BLACK)`
            }
            if (ast.color === "white"){
                return `(Ed.ReadLineState() == Ed.LINE_ON_WHITE)`
            }
        break
        case("obstacle"):
            let activate = "Ed.ObstacleDetectionBeam(Ed.ON)"
            let detect = ""
            switch(ast.direction){
                case("left"):
                detect = `(Ed.ReadObstacleDetection()==Ed.OBSTACLE_LEFT)`
                break
                case("right"):
                detect = `(Ed.ReadObstacleDetection()==Ed.OBSTACLE_RIGHT)`
                break
                case("anywhere"):
                detect = `(Ed.ReadObstacleDetection()>Ed.OBSTACLE_NONE)`
                break
            }
            return `${activate}\n${detect}`
        break
        case("light"):
            let read = ""
            if(ast.side==="left"){
                read = `Ed.ReadLeftLightLevel()`
            }
            if(ast.side==="right"){
                read = `Ed.ReadRightLightLevel()`
            }
            let compare = ""
            if(ast.level==="bright"){compare=">"}
            if(ast.level==="dark"){compare="<"}
            return `(${read} ${compare} _LIGHT_THRESHHOLD)` //threshhold set at beginning
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