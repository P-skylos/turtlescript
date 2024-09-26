// def page elements
const input_box = document.getElementById("input")
const output_box = document.getElementById("output")
const compile_button = document.getElementById("compile")

// button events
function compile_button_handler(){
    console.log("compile press");
    // const parse = module.exports.parse
    const parse = PARSER.parse
    let text = input_box.innerText + '\n'
    let tree
    try{
        tree = parse(text)
    } catch(e){
        if (typeof e.format === "function"){
            console.log(e.format([{source:"minimumcontrol.peggy", text},{source:text, text:text }]))
        }else{throw e;}
    }
    let python = compile_with_checks(tree)
    output_box.innerHTML = python
}

function copy_button_handler(){
    navigator.clipboard.writeText(output_box.innerHTML)
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function download_python(){
    download("EdPy", input_box.innerText)
}

function download_turtle(){
    download("TurtleScript", output_box.innerText)
}

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
    return compile_prelude(ast, counter)
}   