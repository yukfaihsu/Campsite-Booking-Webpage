console.log("Camping site page!")

const fileURL = "../camping-data.json";
let jsonData;

const getCampingSiteList = async () => {
    try {
        const responseFromAPI = await fetch(fileURL);
        jsonData = await responseFromAPI.json();
        console.log(`Data received from API: ${jsonData}`);
    } catch (err) {
        console.log(`Error while fetching data from the API: ${err}`);
    }
}

getCampingSiteList();