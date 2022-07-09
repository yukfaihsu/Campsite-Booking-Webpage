



const reservePressed = () => {
    const numNights = document.querySelector("#numberOfNights").value;
    
    const guestDetails = document.querySelectorAll(".input-guest-details");
    const name = guestDetails[0].value;
    const email = guestDetails[1].value;

    if(numNights === "" || name === "" || email === ""){
        console.log("You must enter all form fields");
        return;
    }

    let reservationNumber = Math.floor(Math.random() * (10000 - 1000)) + 1000;

    document.querySelector("#receipt").innerHTML = 
    `   
        <h1>Reservation #RES - ${reservationNumber}</h1>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Number of Night: ${numNights}</p>
        <p>Nightly Rate: $62.00</p>
        <p>Subtotal: $62.00</p>
        <p>Tax: $8.06</p>
        <p>Total: $70.06</p>
    `;
    
}

document.querySelector("#btn-reserve").addEventListener("click", reservePressed);