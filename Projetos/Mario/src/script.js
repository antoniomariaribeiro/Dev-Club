
let formulario = document.querySelector(".contact")
let mascara = document.querySelector(".mascara-form")


function cliqueiNoBotao() {

    formulario.style.left = "900px"
    mascara.style.visibility = "visible"
}

function sumirFormulario() {

    formulario.style.left = "-320px"
    mascara.style.visibility = "hidden"

}