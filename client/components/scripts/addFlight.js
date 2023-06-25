const addFlight = async e => {
    const newFlightTitleHTMLRef = $("#newFlightTitle");
    const newFlightPriceHTMLRef = $("#newFlightPrice");
    const newFlightCompanyHTMLRef = $('#newFlightCompany');
    const newFlightOriginHTMLRef = $("#newFlightOrigin");
    const newFlightDestinationHTMLRef = $("#newFlightDestination");
    const newFlightdepartTimeHTMLRef = $("#departTime");
    const newFlightEstimatedTimeOfArrivalHTMLRef = $("#newFlightEstimatedTimeOfArrival");
    const data = {
        title: newFlightTitleHTMLRef.val(),
        price: newFlightPriceHTMLRef.val(),
        company: newFlightCompanyHTMLRef.val(),
        origin: newFlightOriginHTMLRef.val(),
        destination: newFlightDestinationHTMLRef.val(),
        departTime: newFlightdepartTimeHTMLRef.val(),
        estimatedTimeOfArrival: newFlightEstimatedTimeOfArrivalHTMLRef.val()
    };
    const b = JSON.stringify(data);
    let newlyAddedFlight = await fetch(`${url}/flights`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: b
    })
    newlyAddedFlight = await newlyAddedFlight.json();
    if (newlyAddedFlight) {
        generateFlightHTML(newlyAddedFlight, featuredDeals.length);
        featuredDeals.push(newlyAddedFlight);
    }
    else {
        console.log(`failed to add class. reason: ${newlyAddedFlight}`);
    }
}