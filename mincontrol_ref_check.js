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
        default:
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
    if (ast.type === "number" || ast.type === "sensor"){return}
    check_math(ast.left, table)
    check_math(ast.right, table)
    
}