let add_flight_form_fields = {};
async function addFlightInitiaizeFormFields() {
    const newFlightTitleJqueryObj = $("#newFlightTitle");
    const newFlightPriceJqueryObj = $("#newFlightPrice");
    const newFlightCompanyJqueryObj = $('#newFlightCompany');
    const newFlightOriginJqueryObj = $("#newFlightOrigin");
    const newFlightDestinationJqueryObj = $("#newFlightDestination");
    const newFlightdepartTimeJqueryObj = $("#departTime");
    const newFlightEstimatedTimeOfArrivalJqueryObj = $("#newFlightEstimatedTimeOfArrival");
    const newFlightUploadFlightImageJuqryObj = $("#uploadFlightImage");
    add_flight_form_fields = {
        newFlightTitleJqueryObj, newFlightPriceJqueryObj, newFlightCompanyJqueryObj,
        newFlightOriginJqueryObj, newFlightDestinationJqueryObj, newFlightdepartTimeJqueryObj,
        newFlightEstimatedTimeOfArrivalJqueryObj,
        newFlightUploadFlightImageJuqryObj
    }
    await populateSelects();
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
        newFlightEstimatedTimeOfArrivalJqueryObj,
        newFlightUploadFlightImageJuqryObj } = add_flight_form_fields;
    const data = {
        title: newFlightTitleJqueryObj.val(),
        price: newFlightPriceJqueryObj.val(),
        company: newFlightCompanyJqueryObj.val(),
        origin: newFlightOriginJqueryObj.val(),
        destination: newFlightDestinationJqueryObj.val(),
        departTime: newFlightdepartTimeJqueryObj.val(),
        estimatedTimeOfArrival: newFlightEstimatedTimeOfArrivalJqueryObj.val(),
    };
    const formData = new FormData();
    Object.keys(data).forEach(field => formData.append(field, data[field]));
    console.log(formData);
    formData.append('image', newFlightUploadFlightImageJuqryObj.prop('files')[0]);
    let newlyAddedFlight = await fetch(`${url}/flights`, {
        method: 'POST',
        body: formData
    })
    newlyAddedFlight = await newlyAddedFlight.json();
    if (newlyAddedFlight.error) {
        console.log(newlyAddedFlight.error);
        return;
    }
    if (newlyAddedFlight) {//if flight was succesfuly added to the database:
        /* first, generate the html component for the new flight */
        generateFlightHTML(newlyAddedFlight, allDeals.length);
        /* next, add it to the list of flights */
        allDeals.push(newlyAddedFlight);
        let postToFB = await fetch(`${url}/facebook`,{
            method:'POST',
            headers,
            body:JSON.stringify(newlyAddedFlight)
        });
        postToFB = await postToFB.json();
        console.log(postToFB);
    }
    else {
        console.log(`failed to add flight. reason: ${newlyAddedFlight}`);
    }
    //Lastly, reseting the form fields
    Object.values(add_flight_form_fields).forEach(jQueryObj => jQueryObj.val(""));
    /* maybe above line un-needed */
    $('#main-component-container').html('');
    loadMainComponent('allFlights');
}

const validate_add_flight_form = () => {
    const { newFlightTitleJqueryObj,
        newFlightPriceJqueryObj,
        newFlightCompanyJqueryObj,
        newFlightOriginJqueryObj,
        newFlightDestinationJqueryObj,
        newFlightdepartTimeJqueryObj,
        newFlightEstimatedTimeOfArrivalJqueryObj,
        newFlightUploadFlightImageJuqryObj } = add_flight_form_fields;
    const add_flight_button = $("#add-flight-btn");
    /* make sure all fields are filled and valid, and if so, allow to submit new flight */
    if (newFlightUploadFlightImageJuqryObj.prop('files').length > 0 &&
        newFlightTitleJqueryObj.val() != "" && newFlightPriceJqueryObj.val() != "" && newFlightCompanyJqueryObj.val() != ""
        && newFlightOriginJqueryObj.val() != newFlightDestinationJqueryObj.val()
        && newFlightdepartTimeJqueryObj.val() && newFlightEstimatedTimeOfArrivalJqueryObj.val() &&
        new Date(newFlightdepartTimeJqueryObj.val()) < new Date(newFlightEstimatedTimeOfArrivalJqueryObj.val())) {
        add_flight_button.removeAttr('disabled')
    }
    /* if one of the fields is not valid, disable the option to submit */
    else {
        add_flight_button.attr('disabled', true);
    }
}

const populateSelects = async () => {
    fetch(`${url}/locations`)
        .then(res => res.json())
        .then(locArr => locArr
            .forEach(locInstance => {
                const selectValue = `${locInstance.airport} ${locInstance.international?'international':''} Airport,${locInstance.cityName},${locInstance.country}`;
                $("#newFlightDestination")
                    .append(`<option value="${selectValue}">${selectValue}</option>`);
                $("#newFlightOrigin")
                    .append(`<option value="${selectValue}">${selectValue}</option>`);
            }))
        .catch(err => console.log(err));
}