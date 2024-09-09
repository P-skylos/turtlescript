// def page elements
const input_box = document.getElementById("input")
const output_box = document.getElementById("output")
const compile_button = document.getElementById("compile")

// button events
function compile_button_handler(){
    console.log("compile press");
    const parse = module.exports.parse
    
    let text = input_box.innerText + '\n'
    let tree = parse(text)
    let python = compile(tree)
    output_box.innerHTML = python
}

function copy_button_handler(){
    navigator.clipboard.writeText(output_box.innerText)
}