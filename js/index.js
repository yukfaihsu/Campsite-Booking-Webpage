//Javascript file for Landing page(index.html)

//console.log("Testing external JS");

//Reserve button click handler
const goToCampPageButton = document.getElementById("goToCampPageButton");

goToCampPageButton.addEventListener('click', () => {
    window.location.href = "./choose-camping.html";
})