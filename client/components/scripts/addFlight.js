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

const validate_add_flight_form = () => {
    const { newFlightTitleJqueryObj,
        newFlightPriceJqueryObj,
        newFlightCompanyJqueryObj,
        newFlightOriginJqueryObj,
        newFlightDestinationJqueryObj,
        newFlightdepartTimeJqueryObj,
        newFlightEstimatedTimeOfArrivalJqueryObj } = add_flight_form_fields;
    const add_flight_button = $("#add-flight-btn");
    if (newFlightTitleJqueryObj.val() != "" && newFlightPriceJqueryObj.val() != "" && newFlightCompanyJqueryObj.val() != ""
        && newFlightOriginJqueryObj.val() != newFlightDestinationJqueryObj.val()
        && newFlightdepartTimeJqueryObj.val() && newFlightEstimatedTimeOfArrivalJqueryObj.val() &&
        new Date(newFlightdepartTimeJqueryObj.val())<new Date(newFlightEstimatedTimeOfArrivalJqueryObj.val())) {
            add_flight_button.removeAttr('disabled')
    }
    else {
        add_flight_button.attr('disabled',true);
    }
}