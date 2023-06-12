let showRegLog = true;//When coming to site for first time/ if you never signed up. new client agents will be required to either join with social account,
//or register.
let showAddFlight = true;
let showFeaturedDeals = true;
let showSearch = false;//Will turn to true after login, be it via login page or from cookies.
const regLogState = {};
const searchState = {};
const featuredDealsState={};
const addFlightState={};

const url = `http://localhost:3000/api`;

//Equivalet to document.onload, Here we set the different states, and add eventListeners as needed.
$(function () {
    console.log("loaded index.js");
    const addFlightForm = $("#add-flight-form");
    addFlightForm.toggleClass("hidden");

    /**
     * State definition and data fetching
     */

    featuredDealsState['htmlREF']=$("#featuredDeals");
    featuredDealsState['deals'] = [];//Will be filled with deals from the database

    /**
     * the bellow function is self activated, it will bring the relevant deaels from the server and then generate html for each flight.
     */
    // (async ()=>{
    //     const res = (await fetch('localhost:3000/api/flights')).json()
    //     console.log(res);
    //     featuredDealsState['deals'] = res;
    //     //TODO: add code to generate flight's html, with the relevant data, and append it to featuredDealsState['htmlREF'].
    // })()

    addFlightState['newFlightTitle']=$("#newFlightTitle");
    addFlightState['newFlightPrice']=$("newFlightPrice");
    addFlightState['newFlightCompany'] = $('#newFlightCompany');
    addFlightState['newFlightOrigin']= $("#newFlightOrigin");
    addFlightState['newFlightDestination']=$("#newFlightDestination");
    addFlightState['newFlightdepartTime']=$("#departTime");
    addFlightState['newFlightEstimatedTimeOfArrival']=$("#newFlightEstimatedTimeOfArrival");
    addFlightState['addFlightBtn']=$("#add-flight-btn");
    addFlightState['submitable'] = false;

    regLogState['login'] = true;//if we want to register, it will be false
    regLogState['emailInput'] = $('#emailInput');
    regLogState['passwordInput'] = $('#passwordInput');
    regLogState['regLogSubmitBtn'] = $('#regLogSubmitBtn');

    searchState['destinationInput'] = $('#destinationInput');
    searchState['originInput'] = $('#originInput');
    searchState['departDateInput'] = $('#departDateInput') ;
    searchState['estimatedTimeOfArrivalInput'] = $('#estimatedTimeOfArrivalInput');
    searchState['priceInput'] = $('#priceInput');
    searchState['companyInput'] = $('#companyInput');
    searchState['searchSubmitBtn'] = $('#searchSubmitBtn');
    /**
     * END of state definition
     */

    /**
     * Attaching handlers to submit buttons
     */
    // regLogState['regLogSubmitBtn'].on('click' ,async ()=>{//TODO: logicaly, button should only be made un-disabled if all the fields are not empty.DO THIS.
    //     const data = {
    //         login:regLogState['login'],
    //         email: regLogState['emailInput'].val,
    //         password: regLogState['passwordInput'].val
    //     }
    //     const res = await fetch(`${url}/users`,{
    //         method:'POST',
    //         body: JSON.stringify(data)
    //     })
    //     //The request is sent as POST both for user login and user register, since I get shows password in URL.
    //     //In addition, the POST will infact update in the database the property: lastLogin.
    // })
    addFlightState['addFlightBtn'].on('click',async ()=>{//TODO: logicaly, button should only be made un-disabled if all the fields are not empty.DO THIS.
        const data = {
            title : addFlightState['newFlightTitle'],
            price : addFlightState['newFlightPrice'],
            company : addFlightState['newFlightCompany'],
            origin : addFlightState['newFlightOrigin'],
            destination : addFlightState['newFlightDestination'],
            departTime : addFlightState['newFlightdepartTime'],
            estimatedTimeOfArrival : addFlightState['newFlightEstimatedTimeOfArrival']
        };
        const newlyAddedFlight = await fetch('http://localhost:3000/api/flights',{
            method:'POST',
            body:JSON.stringify({
                ...data
            })
        })
        if(newlyAddedFlight){
            featuredDealsState['deals'].push(newlyAddedFlight);
            //TODO: ADD code to generate html for new flight, and attach it to the html at the relevant point.
        }
        else{
            console.log(`failed to add class. reason: ${newlyAddedFlight}`);
        }
    })

});