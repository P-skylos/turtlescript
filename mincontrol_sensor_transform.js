function sensor_pass(ast){
    const state = {
        line:"unused",
        light:"unused",
        IR:"unused",
        obstacle:"unused"
    }
}

function sensor_crawl(ast, state){
    switch(ast.type){
        case("sensor"):
            //figure out which sensor and what to do
            break
        case("block"):
            for (let i = 0; i < ast.list.length; i++) {
            sensor_crawl(ast.list[i], state)
            }
            break
        case("go"):
        case("spin"):
            sensor_crawl(ast.duration, state)
            break
        case("def"):
            sensor_crawl(ast.body, state)
            break
        case("if"):
            sensor_crawl(ast.condition, state)
            sensor_crawl(ast.body, state)
            break
        case("repeat"):
            break
        case("until"):
            break
        case("math"):
            if(ast.type !=="math"){sensor_crawl(ast, state)}
            else{
            sensor_crawl(ast.left, state)
            sensor_crawl(ast.right, state)
            }
            break
        default:
            break
    }
}