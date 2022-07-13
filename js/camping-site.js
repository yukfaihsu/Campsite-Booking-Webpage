console.log("Camping site page!")

// ---------------------- Variables ----------------------
const DEFAULT_AVAILABILITY = 10;
const EQUIPMENT_TYPE_SINGLE = "single tent";
const EQUIPMENT_TYPE_THREE_TENTS = "3 tents";
const EQUIPMENT_TYPE_TRAILER = "trailer up to 18ft"; 
const fileURL = "../camping-data.json";
const equipmentTypeFromStorage = localStorage.getItem('equipment-type-from-screen-1');
const availabilityFromStorage = localStorage.getItem('number-of-night-from-screen-1');
let searchByEquipment = null;
let searchByNights = null;

// ---------------------- Helper methods ----------------------

//Get Camping API data func
const getCampingSiteList = async () => {
    let jsonData;
    try {
        const responseFromAPI = await fetch(fileURL);
        jsonData = await responseFromAPI.json();
        console.log(`Data received from API: ${jsonData}`);
        console.log(`Equpment Type: ${equipmentTypeFromStorage}`)
        if(equipmentTypeFromStorage != null && equipmentTypeFromStorage != "show all" && (searchByEquipment == null && searchByNights == null)){
            //some data is retrieved from local storage
            //so filter results
            const results = searchCampSitesUsingEquipment(jsonData, equipmentTypeFromStorage);
            displaySites(results); 
        } else if(searchByEquipment != null){
            //search using equipment
            const results = searchCampSitesUsingEquipment(jsonData, searchByEquipment);
            displaySites(results); 
        } else if (searchByNights != null){

        }else {
            //nothing found in localstorage OR equipment type stored in storage was show all
            //display all jsonData
            displaySites(jsonData)
        }
    } catch (err) {
        console.log(`Error while fetching data from the API: ${err}`);
    }
}

getCampingSiteList();

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
    
    if(jsonData.length === 0){
        containerElement.innerHTML += `<p><span class="red">No CAMP SITE found</span></p>`
    }

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

    if(!currData.isRadioFree && !currData.isPremium && !currData.isRadioFree){
        //none of these features are available
        isPremiumHTML = "None"
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
                <p>Availability: ${DEFAULT_AVAILABILITY} of ${DEFAULT_AVAILABILITY} days</p>
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

//helper func to filter jsonData based on equipment
const searchCampSitesUsingEquipment = (jsonData, equipmentType) => {
    const results = []
    console.log(`Equ ${equipmentType}`)
    for (let i = 0; i < jsonData.length; i++) {
        for (let j=0 ; j < jsonData[i].equipment.length ; j++) {
        const currentEquipmentType = jsonData[i].equipment[j].toLowerCase();
        switch(equipmentType){
            case EQUIPMENT_TYPE_SINGLE: 
                //all
                if(currentEquipmentType.includes(equipmentType)){
                    console.log(`Single Tent`)
                    results.push(jsonData[i]);
                }
            break;
            case EQUIPMENT_TYPE_THREE_TENTS: 
                if(currentEquipmentType === EQUIPMENT_TYPE_THREE_TENTS || currentEquipmentType === EQUIPMENT_TYPE_TRAILER){
                    console.log(`3 tents`);
                    if(!results.some(element => element.siteNumber === jsonData[i].siteNumber)){
                        //to avoid adding duplicates
                        results.push(jsonData[i]);
                        console.log(`Results : ${results}`)
                    }
                }
            break;
            case EQUIPMENT_TYPE_TRAILER: 
                if(jsonData[i].equipment[0].toLowerCase() === EQUIPMENT_TYPE_TRAILER){
                    console.log(`Trailer`)
                    results.push(jsonData[i]);
                }
            break;
            case "show all": 
                if(!results.some(element => element.siteNumber === jsonData[i].siteNumber)){
                    //to avoid adding duplicates
                    results.push(jsonData[i]);
                    console.log(`Results : ${results}`)
                }
            break;
        }
        }
    }
    // return the results of the search as an array
    return results
}

//helper func to filter json data based on nights
const searchCampSitesUsingNights = (jsonData, nights) => {
    const results = []
    console.log(`Nights ${equipmentType}`)
    for (let i = 0; i < jsonData.length; i++) {

    }
    // return the results of the search as an array
    return results
}

// ---------------------- Event Handler functions ----------------------
const equipmentTypeChanged = (evt) => {
    const elementClicked = evt.target
    console.log(`Equipment container changed`)
    console.log(elementClicked.value); // get selected VALUE
    searchByEquipment = elementClicked.value;
    getCampingSiteList();
}

const nightsTypeChanged = (evt) => {
    const elementClicked = evt.target
    console.log(elementClicked.value); // get selected VALUE
    searchByNights = elementClicked.value;

}

// ---------------------- Event listeners ----------------------
// listener for the filter equipment options container
document.querySelector("#equipment").addEventListener("change", equipmentTypeChanged)

 // listener for the filter equipment options container
 document.querySelector("#nights").addEventListener("change", nightsTypeChanged)