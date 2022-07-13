const campsite =
[
    {
    "siteNumber": 625,
    "equipment": [
    "Single Tent",
    " 3 Tents",
    " Trailer up to 18ft"
    ],
    "hasPower": true,
    "isPremium": false,
    "isRadioFree": true,
    "image": "https://picsum.photos/id/1020/400"
    }
];

const availableNight = 8.999;
const normalNightlyRate = 47.5;
const tax = 0.13;

// Helper functions
const calculateDailyCost = () => {
    let nightlyRate = normalNightlyRate;
    const currCampsite = campsite[0];

    if(currCampsite.isPremium === true){
        nightlyRate = nightlyRate * 1.2;
    }
    if(currCampsite.hasPower === true){
        nightlyRate += 5;
    }

    return nightlyRate;
}

const displayCampsiteInfo = () => {
    const currCampsite = campsite[0];

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

    let campsiteInfomation = document.querySelector("section");
    campsiteInfomation.innerHTML = 
    `
        <h1>1. Site Information</h1>
        <p>Site: <span>${currCampsite.siteNumber}</span></p>
        <p>Equipment: <span>${tentType}</span></p>
        <p>${icons}</p>
        <p>Availability: <span>${availableNight}</span> of 10 days</p>
    `;
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
            <p>You must enter all form fields</p>
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
    
}
document.addEventListener("DOMContentLoaded", displayCampsiteInfo);
document.querySelector("#btn-reserve").addEventListener("click", reservePressed);