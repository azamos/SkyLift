let allFlightsDeals = [];

async function loadAllFlights (){
    /* brings hot deals, no need for authorization.Alternitavely, send authorization: Guest */
    let res = await fetch(`${url}/flights`);
    res = await res.json();
    res.forEach((flightModelInstance, i) => {
        $("#featuredDeals").append(generateFlightHTML(flightModelInstance, i , false));
        allFlightsDeals.push(flightModelInstance);
    });
}
