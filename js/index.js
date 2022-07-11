//Javascript file for Landing page(index.html)
//console.log("Testing external JS");

// ---------------------- Event Handler functions ----------------------
const buttonClicked = () => {
    console.log(`Reserve button clicked!`);
    window.location.href = "./camping-site-page/choose-camping.html";

    const formFields = document.querySelectorAll("select");

    localStorage.setItem("equipment-type-from-screen-1", formFields[0].value);
    localStorage.setItem("number-of-night-from-screen-1", formFields[1].value);
}


// ---------------------- Event listeners ----------------------
// listener for the reserve button
document.querySelector("#camp-page-btn").addEventListener("click", buttonClicked);