// def page elements
const input_box = document.getElementById("input")
const output_box = document.getElementById("output")
const compile_button = document.getElementById("compile")

// button events
function compile_button_handler(){
    console.log("compile press");
    const parse = module.exports.parse
    
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
    navigator.clipboard.writeText(output_box.innerText)
}