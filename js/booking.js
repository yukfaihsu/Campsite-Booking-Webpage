const campsiteFromLocalStorage = localStorage.getItem("currentCampingSite"); 
const KEY_NAME = "availableNights"
const availableNightsForCampsite = JSON.parse(localStorage.getItem(KEY_NAME));


const availableNight = 8.999;
const normalNightlyRate = 47.5;
const tax = 0.13;

// Helper functions
const calculateDailyCost = () => {
    let nightlyRate = normalNightlyRate;
    const currCampsite = JSON.parse(campsiteFromLocalStorage);

    if(currCampsite.isPremium === true){
        nightlyRate = nightlyRate * 1.2;
    }
    if(currCampsite.hasPower === true){
        nightlyRate += 5;
    }

    return nightlyRate;
}

const displayCampsiteInfo = () => {
    let currCampsite = JSON.parse(campsiteFromLocalStorage); //since we get a string from localstorage, we need to parse as an object
    const nightsCurrCampsite = availableNightsForCampsite[currCampsite.siteNumber];
    let tentType = "";
    for(equip of currCampsite.equipment){
        tentType += `${equip}, `
    }
    tentType = tentType.substring(0, tentType.lastIndexOf(","));

    let icons = "";
    if(currCampsite.isPremium === true){
        icons += `<span class="material-icons">star</span>`;
    }
    if(currCampsite.hasPower === true){
        icons += `<span class="material-icons">power</span>`;
    }
    if(currCampsite.isRadioFree === true){
        icons += `<span class="material-icons">radio</span>`;
    }

    let campsiteInfomation = document.querySelector("#camp-site-info");
    campsiteInfomation.innerHTML = 
    `
        <h1>1. Site Information</h1>
        <p>Site: <span>${currCampsite.siteNumber}</span></p>
        <p>Equipment: <span>${tentType}</span></p>
        <p>${icons}</p>
        <p>Availability: <span id="availability">${nightsCurrCampsite}</span> of 10 days</p>
    `;

    document.querySelector("#selector-numberOfNights").innerHTML = 
    `
        <input type="number" max="${nightsCurrCampsite}" min="1" name="numberOfNights" onKeyDown="return false" id="numberOfNights"></input>
    `;

    if(document.querySelector("#availability").innerHTML === "0"){
        document.querySelector("#btn-reserve").hidden = true;
        document.querySelector("#receipt").innerHTML = `<h2>This campsite is fully booked.</h2>`
    }
}


const reservePressed = () => {
    const numNights = document.querySelector("#numberOfNights").value;
    
    const guestDetails = document.querySelectorAll(".input-guest-details");
    const name = guestDetails[0].value;
    const email = guestDetails[1].value;

    if(numNights === "" || name === "" || email === ""){
        console.log("You must enter all form fields");
        document.querySelector("#receipt").innerHTML = 
        `
            <p class="red">You must enter all form fields</p>
        `;
        return;
    }

    let reservationNumber = Math.floor(Math.random() * (10000 - 1000)) + 1000;
    
    const nightlyRate = calculateDailyCost();
    const subtotal = nightlyRate * numNights;
    const taxAmount = subtotal * tax;
    const total= subtotal + taxAmount;

    document.querySelector("#receipt").innerHTML = 
    `   
        <h1>Reservation #RES - ${reservationNumber}</h1>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Number of Night: ${numNights}</p>
        <p>Nightly Rate: $${nightlyRate.toFixed(2)}</p>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax: $${taxAmount.toFixed(2)}</p>
        <p>Total: $${total.toFixed(2)}</p>
    `;

    let currCampsite = JSON.parse(campsiteFromLocalStorage);
    let nightsCurrCampsite = availableNightsForCampsite[currCampsite.siteNumber];
    const newNumNight = nightsCurrCampsite - numNights;
    availableNightsForCampsite[currCampsite.siteNumber] = newNumNight;
    localStorage.setItem(KEY_NAME, JSON.stringify(availableNightsForCampsite));

    document.querySelector("#btn-reserve").hidden = true;
    document.querySelector("#availability").innerHTML = `${newNumNight}`;
}
document.addEventListener("DOMContentLoaded", displayCampsiteInfo);
document.querySelector("#btn-reserve").addEventListener("click", reservePressed);