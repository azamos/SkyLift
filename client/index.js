const featuredDeals = [];

const url = `http://localhost:3000/api`;
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

const generateFlightHTML = (flightModelInstance,i) => {
    let htmlRef = $("#flight-template").clone();
    htmlRef.removeAttr('style');
    htmlRef.children('.destination-photo').attr('src',`./images/destination/${camelize(flightModelInstance.destination)}.jpg`)
    htmlRef.attr('id',`FLIGHT #${i+1}`);
    let flightHeader = htmlRef.children('.flight-header');
    flightHeader.children('.price').text(`PRICE: ${flightModelInstance.price}$`)
    flightHeader.children('.flight-title').text(`FLIGHT NUMBER:  ${flightModelInstance.title}`)
    let content = htmlRef.children('.content');
    content.children('.origin').text(`From: ${flightModelInstance.origin}`)
    content.children('.destination').text(`To: ${flightModelInstance.destination}`)
    content.children('.departure').text(`Departing: ${flightModelInstance.departTime}`)
    content.children('.arrival').text(`ETA: ${flightModelInstance.estimatedTimeOfArrival}`)
    //content.children('.connection').text(`${flightModelInstance.<replaceWithModelPropertyName>}`)
    $("#featuredDeals").append(htmlRef);
}
//Equivalet to document.onload, Here we set the different states, and add eventListeners as needed.
//TODO: is this supposed to be async?
$(function () {
    /**
     * the bellow function is self activated, it will bring the relevant deals from the server and then generate html for each flight.
     */
    (async ()=>{
        let res = await fetch(`${url}/flights`);
        res = await res.json();
        res.forEach((flightModelInstance,i)=>{ 
            generateFlightHTML(flightModelInstance,i)
            featuredDeals.push(flightModelInstance);
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
        let newlyAddedFlight = await fetch(`${url}/flights`,{
            method:'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body:b
        })
        newlyAddedFlight = await newlyAddedFlight.json();
        if(newlyAddedFlight){
            generateFlightHTML(newlyAddedFlight,featuredDeals.length);
            featuredDeals.push(newlyAddedFlight);
        }
        else{
            console.log(`failed to add class. reason: ${newlyAddedFlight}`);
        }
    })

});

const deleteAll = async () => await fetch('http://localhost:3000/api/flights/deleteall') 