//Javascript file for Landing page(index.html)
//console.log("Testing external JS");

// ---------------------- Event Handler functions ----------------------
const buttonClicked = () => {
    console.log(`Reserve button clicked!`)
    window.location.href = "./choose-camping.html";
}


// ---------------------- Event listeners ----------------------
// listener for the reserve button
document.querySelector("#camp-page-btn").addEventListener("click", buttonClicked)