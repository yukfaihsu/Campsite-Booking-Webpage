//console.log("Camping site page!")

// ---------------------- Variables ----------------------
const fileURL = "../camping-data.json";
const campSitesList = [];

const DEFAULT_AVAILABILITY = 10;

const EQUIPMENT_TYPE_SINGLE = "single tent";
const EQUIPMENT_TYPE_THREE_TENTS = "3 tents";
const EQUIPMENT_TYPE_TRAILER = "trailer up to 18ft"; 

const equipmentTypeFromStorage = localStorage.getItem('equipment-type-from-screen-1');
const availabilityFromStorage = localStorage.getItem('number-of-night-from-screen-1');

const KEY_NAME_AVAILABLE_NIGHT = "availableNights";

// ---------------------- Helper methods ----------------------

//Get Camping API data func
const getCampingSiteList = async () => {
    try {
        const responseFromAPI = await fetch(fileURL);
        const jsonData = await responseFromAPI.json();
        console.log(`Data received from API: ${jsonData}`);
        if(localStorage.hasOwnProperty(KEY_NAME_AVAILABLE_NIGHT) === false){
            let availableNightsForCampsite = {};
            for(let key in jsonData){
                const currCamp = jsonData[key];

                availableNightsForCampsite[currCamp.siteNumber] = 10;
            }
            localStorage.setItem(KEY_NAME_AVAILABLE_NIGHT, JSON.stringify(availableNightsForCampsite));
        } 
        return jsonData;
    } catch (err) {
        console.log(`Error while fetching data from the API: ${err}`);
    }
}

//helper func to create camp sites in our file
const createCampSitesList = (jsonData) => {
    for(let i=0; i <jsonData.length; i++){
        let currentObject = jsonData[i];
        campSitesList.push(currentObject);
    }
    console.log(`Created list ${campSitesList}`)
}


//helper func to display camping data 
const displaySites = (campData) => {
    containerElement = document.querySelector("#camping-results-container")
                
    // - clear the contents of the container
    containerElement.innerHTML = ""

    let isRadioFreeHTML = "";
    let hasPowerHTML = "";
    let isPremiumHTML = ""; 
    
    if(campData.length === 0){
        //empty array of sites
        containerElement.innerHTML += `<p><span class="red">No CAMP SITE found</span></p>`
    } else {
        //loop through array
        for(let i =0; i<campData.length; i++){
            const currentSite = campData[i]
            console.log(`Current Data: ${currentSite}`)
            
            let equipmentHTML = "";
            for(equipmentType of currentSite.equipment){
                equipmentHTML += `${equipmentType}, `
            }

            //splitting and displaying equipments array
            equipmentHTML = equipmentHTML.substring(0, equipmentHTML.lastIndexOf(","));

            let availabilityHTML = "";
            
            if(currentSite.isRadioFree){
                //radio is free so add the radio icon
                // console.log(currentSite.isRadioFree)
                isRadioFreeHTML = `<p><span class="material-icons">radio</span></p>`
            } else {
                isRadioFreeHTML = ""
            }

            if(currentSite.isPremium){
                isPremiumHTML = `<p><span class="material-icons">star</span></p>`
            } else {
                isPremiumHTML = ""
            }

            if(currentSite.hasPower){
                hasPowerHTML = `<p><span class="material-icons">power</span></p>`
            } else {
                hasPowerHTML = ""
            }

            //in case no features exist, display None
            if(!currentSite.isRadioFree && !currentSite.isPremium && !currentSite.isRadioFree){
                //none of these features are available
                isPremiumHTML = "None"
            }

            // check for availability
            const availableNightsForAll = JSON.parse(localStorage.getItem(KEY_NAME_AVAILABLE_NIGHT));
            const currCampsiteNight = availableNightsForAll[currentSite.siteNumber];

            //display availability
            for(let i=0; i<(DEFAULT_AVAILABILITY - currCampsiteNight); i++){
                availabilityHTML += `
                    <div>
                        <p><span class="material-icons-outlined red">cancel</span></p>
                    </div>
                `
            }
            
            for(let i=0; i<currCampsiteNight; i++){
                availabilityHTML += `
                    <div>
                        <p><span class="material-icons-outlined green">circle</span></p>
                    </div>
                `
            }

            //add card results to container
            if(currCampsiteNight > 0){
                    //display site if available nights > 0
                    containerElement.innerHTML += `
                    <div class="camp-card">
                        <div>
                            <img src="${currentSite.image}" />
                        </div>
                        <div>
                            <h3>Site ${currentSite.siteNumber}</h3>
                            <p>Equipment: ${equipmentHTML} </p>
                            <p>Availability: ${currCampsiteNight} of ${DEFAULT_AVAILABILITY} days</p>
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
                        <button data-site-number=${currentSite.siteNumber} class="yellow-primary-button book-site-button">Book Site</button>
                    </div>
                `
            }
        }
    }
}

//helper func to filter jsonData based on equipment
const searchCampSitesUsingEquipment = (campData, equipmentType) => {
    const results = []
    console.log(`Searching for ${equipmentType} equipment`)
    console.log(campData.length)
    for (let i = 0; i < campData.length; i++) {
        const currentCampingSite = campData[i];
        for (let j=0 ; j < campData[i].equipment.length ; j++) {
        const currentEquipmentType = currentCampingSite.equipment[j].toLowerCase();
        switch(equipmentType){
            case EQUIPMENT_TYPE_SINGLE: 
                //all sites that include single tent
                if(currentEquipmentType === EQUIPMENT_TYPE_SINGLE){
                    console.log(`Single Tent`)
                    results.push(campData[i]);
                }
            break;
            case EQUIPMENT_TYPE_THREE_TENTS: 
                //sites that include either 3 tent or trailer
                if((currentEquipmentType === EQUIPMENT_TYPE_THREE_TENTS ||
                    currentEquipmentType === EQUIPMENT_TYPE_TRAILER)){
                    console.log(`3 tents`);
                    if(!results.some(element => element.siteNumber === campData[i].siteNumber)){
                        //to avoid adding duplicates
                        results.push(campData[i]);
                        console.log(`Results : ${results}`)
                    
                    }
                }   
            break;
            case EQUIPMENT_TYPE_TRAILER: 
                // sites that include trailer
                if(currentEquipmentType === EQUIPMENT_TYPE_TRAILER){
                    console.log(`Trailer`)
                    results.push(campData[i]);
                }
            break;
            case "show all": 
                if(!results.some(element => element.siteNumber === campData[i].siteNumber)){
                    //to avoid adding duplicates
                    results.push(campData[i]);
                    console.log(`Results : ${results}`)
                }
            break;
        }
        }
    }
    displaySites(results);
}

const checkIfEquipmentAndNightsInStorage = () => {
    //check if there's equipment type in local storage
    // console.log(campSitesList)
    if(equipmentTypeFromStorage == null && availabilityFromStorage == null){
        //show all the sites
        displaySites(campSitesList);
    } else if(equipmentTypeFromStorage != null && availabilityFromStorage != null) {
        //equipment and available night exist in local storage
        console.log(equipmentTypeFromStorage)
        console.log(availabilityFromStorage)
        //1. Change the filter value of equipment and nights to what was stored
        document.querySelector("#equipment").value = equipmentTypeFromStorage;
        document.querySelector("#nights").value = availabilityFromStorage;

        //2. Search using both the equipment type and available nights type and display
        let searchedCampsiteList = [];
        const siteNumbersSuitable = []
        const availableNightsForAll = JSON.parse(localStorage.getItem(KEY_NAME_AVAILABLE_NIGHT));
        for (let key in availableNightsForAll){
            if(availableNightsForAll[key] >= availabilityFromStorage){
                siteNumbersSuitable.push(`${key}`);
            }
        }
        siteNumbersSuitable.forEach(siteNum => {
            for(let key in campSitesList){
                if(campSitesList[key].siteNumber == siteNum){
                    searchedCampsiteList.push(campSitesList[key]);
                }
            }
        })
        searchCampSitesUsingEquipment(searchedCampsiteList, equipmentTypeFromStorage);

        //3. Clear the equipment from storage
        localStorage.removeItem("equipment-type-from-screen-1");
        localStorage.removeItem("number-of-night-from-screen-1");
    }
}


//helper func to filter json data based on nights
const searchCampSitesUsingNights = (campData, nights) => {
    const results = []
    const siteNumbersSuitable = []
    console.log(`To search for ${nights} nights`)
    
    document.querySelector("#nights").value = nights;
    const availableNightsForAll = JSON.parse(localStorage.getItem(KEY_NAME_AVAILABLE_NIGHT));
    for (let key in availableNightsForAll){
        if(availableNightsForAll[key] >= nights){
            siteNumbersSuitable.push(`${key}`);
        }
    }

    siteNumbersSuitable.forEach(siteNum => {
        for(let key in campData){
            if(campData[key].siteNumber == siteNum){
                results.push(campData[key]);
            }
        }
    })

    console.log(JSON.stringify(siteNumbersSuitable));
    displaySites(results);

    document.querySelector("#equipment").value = "show all";
}


// ---------------------- Event Handler functions ----------------------

const pageLoaded = () => {
    console.log(`Camping Page Loaded!`)
    
    //programmatically create number of nights dropdown using default availablity
    let container = document.querySelector("#nights");
    for (let i = 1; i <= DEFAULT_AVAILABILITY; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        container.appendChild(option);
    }

    //call the api func and getting the promise results
    getCampingSiteList().then(data => {
        console.log(`API data received successfully`)
        
        //console.log(data)
        createCampSitesList(data)
        
        //check if there's equipment type in local storage
        checkIfEquipmentAndNightsInStorage();
    });
}

const equipmentTypeChanged = (evt) => {
    const elementClicked = evt.target
    console.log(`Equipment container changed`)
    console.log(elementClicked.value); // get selected VALUE
    searchCampSitesUsingEquipment(campSitesList,elementClicked.value);
    document.querySelector("#nights").value = 1;
}

const nightsTypeChanged = (evt) => {
    const elementClicked = evt.target
    console.log(elementClicked.value); // get selected VALUE
    searchCampSitesUsingNights(campSitesList, elementClicked.value);
}

const bookButtonPressed = (evt) => {
    const elementClicked = evt.target
    if(elementClicked.tagName === "BUTTON"){
        console.log(`Book Site button Pressed!`)
        let currentSiteNumber = elementClicked.getAttribute("data-site-number")
        console.log(`Site Number : ${currentSiteNumber}`);
        console.log(`lenght: ${campSitesList.length}`)
        for(let i=0; i<campSitesList.length; i++){
            console.log(campSitesList[i])
            if(campSitesList[i]["siteNumber"] == currentSiteNumber){
                // Put the object into storage
                console.log(`Site Found : ${campSitesList[i]}`);
                localStorage.setItem("currentCampingSite", JSON.stringify(campSitesList[i]));
                //go to booking page
                window.location.href = "../booking-page/booking.html";
            }
        }
    }
}

// ---------------------- Event listeners ----------------------

//listener for when page loads
document.addEventListener("DOMContentLoaded", pageLoaded);

// listener for the filter equipment options container
document.querySelector("#equipment").addEventListener("change", equipmentTypeChanged)

// listener for the filter available nights options container
 document.querySelector("#nights").addEventListener("change", nightsTypeChanged)

//listeneer for the button
document.querySelector("#camping-results-container").addEventListener("click", bookButtonPressed)