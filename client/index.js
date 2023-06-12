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
//TODO: is this supposed to be async?
$(function () {
    const addFlightForm = document.getElementById("add-flight-form");
    //addFlightForm.toggleClass("hidden");

    /**
     * State definition and data fetching
     */

    //featuredDealsState['htmlREF']=$("#featuredDeals");
    //featuredDealsState['deals'] = [];//Will be filled with deals from the database

    /**
     * the bellow function is self activated, it will bring the relevant deals from the server and then generate html for each flight.
     */
    (async ()=>{
        let res = await fetch(`${url}/flights`);
        res = await res.json();
        console.log(res);
        res.forEach((flightModelInstance,i)=>{
            let htmlRef = $("#flight-template").clone();
            htmlRef.removeClass('hidden');
            htmlRef.attr('id',`FLIGHT #${i+1}`);
            htmlRef.children('.price').text(`${flightModelInstance.price}`)
            htmlRef.children('.flight-title').text(`${flightModelInstance.title}`)
            let content = htmlRef.children('.content');
            console.log(content.children('.origin'));
            content.children('.origin').text(`${flightModelInstance.origin}`)
            content.children('.destination').text(`${flightModelInstance.destination}`)
            content.children('.departure').text(`${flightModelInstance.departTime}`)
            content.children('.arrival').text(`${flightModelInstance.estimatedTimeOfArrival}`)
            //content.children('.connection').text(`${flightModelInstance.departure}`)
            $("#featuredDeals").append(htmlRef);
        });
    })()

    const newFlightTitleHTMLRef=document.getElementById("newFlightTitle");
    const newFlightPriceHTMLRef=document.getElementById("newFlightPrice");
    const newFlightCompanyHTMLRef = document.getElementById('newFlightCompany');
    const newFlightOriginHTMLRef= document.getElementById("newFlightOrigin");
    const newFlightDestinationHTMLRef=document.getElementById("newFlightDestination");
    const newFlightdepartTimeHTMLRef=document.getElementById("departTime");
    const newFlightEstimatedTimeOfArrivalHTMLRef=document.getElementById("newFlightEstimatedTimeOfArrival");
    const addFlightBtnHTMLRef=document.getElementById("add-flight-btn");

    const emailInputHTMLRef = document.getElementById('emailInput');
    const passwordInputHTMLRef = document.getElementById('passwordInput');
    const regLogSubmitBtnHTMLRef = document.getElementById('regLogSubmitBtn');

    const destinationInputHTMLRef = document.getElementById('destinationInput');
    const originInputHTMLRef = document.getElementById('originInput');
    const departDateInputHTMLRef = document.getElementById('departDateInput') ;
    const estimatedTimeOfArrivalInputHTMLRef = document.getElementById('estimatedTimeOfArrivalInput');
    const priceInputHTMLRef = document.getElementById('priceInput');
    const companyInputHTMLRef =document.getElementById('companyInput');
    const searchSubmitBtnHTMLRef = document.getElementById('searchSubmitBtn');
    /**
     * END of state definition
     */

    /**
     * Attaching handlers to submit buttons
     */
    addFlightBtnHTMLRef.addEventListener('click',async ()=>{//TODO: logicaly, button should only be made un-disabled if all the fields are not empty.DO THIS.
        const data = {
            title : newFlightTitleHTMLRef.value,
            price : newFlightPriceHTMLRef.value,
            company : newFlightCompanyHTMLRef.value,
            origin : newFlightOriginHTMLRef.value,
            destination : newFlightDestinationHTMLRef.value,
            departTime : newFlightdepartTimeHTMLRef.value,
            estimatedTimeOfArrival : newFlightEstimatedTimeOfArrivalHTMLRef.value
        };
        const b = JSON.stringify(data);
        const newlyAddedFlight = await fetch(`${url}/flights`,{
            method:'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body:b
        })
        if(newlyAddedFlight){
            console.log("added new flight. details below");
            console.log(newlyAddedFlight);
            //TODO: ADD code to generate html for new flight, and attach it to the html at the relevant point.
        }
        else{
            console.log(`failed to add class. reason: ${newlyAddedFlight}`);
        }
    })

});