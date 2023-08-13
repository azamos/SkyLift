let add_flight_form_fields = {};
function addFlightInitiaizeFormFields() {
    const newFlightTitleJqueryObj = $("#newFlightTitle");
    const newFlightPriceJqueryObj = $("#newFlightPrice");
    const newFlightCompanyJqueryObj = $('#newFlightCompany');
    const newFlightOriginJqueryObj = $("#newFlightOrigin");
    const newFlightDestinationJqueryObj = $("#newFlightDestination");
    const newFlightdepartTimeJqueryObj = $("#departTime");
    const newFlightEstimatedTimeOfArrivalJqueryObj = $("#newFlightEstimatedTimeOfArrival");
    add_flight_form_fields = {
        newFlightTitleJqueryObj, newFlightPriceJqueryObj, newFlightCompanyJqueryObj,
        newFlightOriginJqueryObj, newFlightDestinationJqueryObj, newFlightdepartTimeJqueryObj,
        newFlightEstimatedTimeOfArrivalJqueryObj
    }
    /* adding change-event-listeners to all of the form fields */
    Object.values(add_flight_form_fields).forEach(jQueryObj => jQueryObj.on('change', validate_add_flight_form));
}

const addFlight = async e => {
    const { newFlightTitleJqueryObj,
        newFlightPriceJqueryObj,
        newFlightCompanyJqueryObj,
        newFlightOriginJqueryObj,
        newFlightDestinationJqueryObj,
        newFlightdepartTimeJqueryObj,
        newFlightEstimatedTimeOfArrivalJqueryObj } = add_flight_form_fields;
    const data = {
        title: newFlightTitleJqueryObj.val(),
        price: newFlightPriceJqueryObj.val(),
        company: newFlightCompanyJqueryObj.val(),
        origin: newFlightOriginJqueryObj.val(),
        destination: newFlightDestinationJqueryObj.val(),
        departTime: newFlightdepartTimeJqueryObj.val(),
        estimatedTimeOfArrival: newFlightEstimatedTimeOfArrivalJqueryObj.val()
    };
    const b = JSON.stringify(data);
    let newlyAddedFlight = await fetch(`${url}/flights`, {
        method: 'POST',
        headers,
        body: b
    })
    newlyAddedFlight = await newlyAddedFlight.json();
    if(newlyAddedFlight.error){
        console.log(newlyAddedFlight.error);
        return;
    }
    if (newlyAddedFlight) {//if flight was succesfuly added to the database:
        /* first, generate the html component for the new flight */
        generateFlightHTML(newlyAddedFlight, allDeals.length);
        /* next, add it to the list of flights */
        allDeals.push(newlyAddedFlight);
    }
    else {
        console.log(`failed to add flight. reason: ${newlyAddedFlight}`);
    }
    //Lastly, reseting the form fields
    Object.values(add_flight_form_fields).forEach(jQueryObj=>jQueryObj.val(""));
    /* maybe above line un-needed */
    loadMainComponent('allFlights');
}

const validate_add_flight_form = () => {
    const { newFlightTitleJqueryObj,
        newFlightPriceJqueryObj,
        newFlightCompanyJqueryObj,
        newFlightOriginJqueryObj,
        newFlightDestinationJqueryObj,
        newFlightdepartTimeJqueryObj,
        newFlightEstimatedTimeOfArrivalJqueryObj } = add_flight_form_fields;
    const add_flight_button = $("#add-flight-btn");
    /* make sure all fields are filled and valid, and if so, allow to submit new flight */
    if (newFlightTitleJqueryObj.val() != "" && newFlightPriceJqueryObj.val() != "" && newFlightCompanyJqueryObj.val() != ""
        && newFlightOriginJqueryObj.val() != newFlightDestinationJqueryObj.val()
        && newFlightdepartTimeJqueryObj.val() && newFlightEstimatedTimeOfArrivalJqueryObj.val() &&
        new Date(newFlightdepartTimeJqueryObj.val())<new Date(newFlightEstimatedTimeOfArrivalJqueryObj.val())) {
            add_flight_button.removeAttr('disabled')
    }
    /* if one of the fields is not valid, disable the option to submit */
    else {
        add_flight_button.attr('disabled',true);
    }
}