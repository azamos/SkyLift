const featuredDeals = [];

const url = `http://localhost:3000/api`;
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}
const views_path = "./components/views";
const scripts_path = "./components/scripts";

//Equivalet to document.onload, Here we set the different states, and add eventListeners as needed.
//TODO: is this supposed to be async?
$(async function () {
    $("#searchbarContainer").load(`${views_path}/searchbar.html`);
    $("#featuredDeals").load(`${views_path}/flight.html`);
    $("#formContainer").load(`${views_path}/loginform.html`,x=> $("#login-submit").on('click',login));
    $("#registerContainer").load(`${views_path}/registerform.html`,x=>$("#register-submit").on('click',register));

    $("#addFlightFormContainer").load('./views/addFlightForm.html');
    /**
     * the bellow function is self activated, it will bring the relevant deals from the server and then generate html for each flight.
     */
    (async () => {
        let res = await fetch(`${url}/flights`);
        res = await res.json();
        res.forEach((flightModelInstance, i) => {
            generateFlightHTML(flightModelInstance, i)
            featuredDeals.push(flightModelInstance);
        });
    })()

    const newFlightTitleHTMLRef = $("#newFlightTitle");
    const newFlightPriceHTMLRef = $("#newFlightPrice");
    const newFlightCompanyHTMLRef = $('#newFlightCompany');
    const newFlightOriginHTMLRef = $("#newFlightOrigin");
    const newFlightDestinationHTMLRef = $("#newFlightDestination");
    const newFlightdepartTimeHTMLRef = $("#departTime");
    const newFlightEstimatedTimeOfArrivalHTMLRef = $("#newFlightEstimatedTimeOfArrival");
    const addFlightBtnHTMLRef = $("#add-flight-btn");
    /**
     * Attaching handlers to submit buttons
     */
    addFlightBtnHTMLRef.on('click', async () => {//TODO: logicaly, button should only be made un-disabled if all the fields are not empty.DO THIS.
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
    })

});