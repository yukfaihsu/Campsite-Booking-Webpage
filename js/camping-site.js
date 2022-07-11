console.log("Camping site page!")

// ---------------------- Variables ----------------------
const DEFAULT_AVAILABILITY = 10;
const fileURL = "../camping-data.json";

//Get Camping API data func
const getCampingSiteList = async () => {
    let jsonData;
    try {
        const responseFromAPI = await fetch(fileURL);
        jsonData = await responseFromAPI.json();
        console.log(`Data received from API: ${jsonData}`);
        displaySites(jsonData)
    } catch (err) {
        console.log(`Error while fetching data from the API: ${err}`);
    }
}

getCampingSiteList();

// ---------------------- Helper methods ----------------------

//helper func to display camping data 
const displaySites = (jsonData) => {
    //1. TODO: check for data from previous page(Filter)
    //2. display camp data(Show All)
    containerElement = document.querySelector("#camping-results-container")
                
    // - clear the contents of the container
    containerElement.innerHTML = ""

    let isRadioFreeHTML = "";
    let hasPowerHTML = "";
    let isPremiumHTML = ""; 
    

    // - loop through json data
    for(let i=0; i<jsonData.length; i++){
    const currData = jsonData[i]
    console.log(`Current Data: ${currData}`)
    
    let availabilityHTML = "";

    if(currData.isRadioFree){
        console.log(currData.isRadioFree)
        isRadioFreeHTML = `<p><span class="material-icons">radio</span></p>`
    } else {
        isRadioFreeHTML = ""
    }

    if(currData.isPremium){
        isPremiumHTML = `<p><span class="material-icons">star</span></p>`
    } else {
        isPremiumHTML = ""
    }

    if(currData.hasPower){
        hasPowerHTML = `<p><span class="material-icons">power</span></p>`
    } else {
        hasPowerHTML = ""
    }

    //TODO: check for availability
    for(let i=0; i<DEFAULT_AVAILABILITY; i++){
        availabilityHTML += `
            <div>
                <p><span class="material-icons-outlined green">circle</span></p>
            </div>
        `
    }


    containerElement.innerHTML += `
        <div id="camp-card">
            <div>
                <img src="${currData.image}" />
            </div>
            <div>
                <h3>Site ${currData.siteNumber}</h3>
                <p>Equipment: ${currData.equipment} </p>
                <p>Availability: </p>
                <div class="inline-icons-container">
                    ${availabilityHTML}
                </div>
                <h4>Site Features: </h4>
                <div class="inline-icons-container">
                    ${isPremiumHTML}
                    ${hasPowerHTML}
                    ${isRadioFreeHTML}
                </div>
            </div>
            <button class="yellow-primary-button book-site-button">Book Site</button>
        </div>
    `
    }
   
}

// ---------------------- Event listeners ----------------------
