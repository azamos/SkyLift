const featuredDeals = [];

const url = `http://localhost:3000/api`;
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}
const views_path = "./components/views";
/**
 *Equivalet to document.onload, Here we:
  1.load the HTML components("views") into the main HTML file,
  into "container divs", which are <div> elements meant to contain the components.
  
  2.request the following from the server:
    2.1. hot deals
    2.2. if user login was saved on cookie, we ask the server to bring the user's data,
         such as purchase history, and if he has any admin privileges.
         2.2.1. Of course, if admin credentials exits, show the admin interface.
        NOTE: if cookie exists, the cart data should be on it. Otherwise, we will also bring it from the server.
 */

$(async function () {
    //LOADING VIEW COMPONENTS INTO index.html
    $("#searchbarContainer").load(`${views_path}/searchbar.html`,x=>{
        $("#navSubmit").on('click',searchFlight);
        $("#destination-dropdown").hide();//hide dropdown
        $("#origin-dropdown").hide();//hide dropdown
        $("#originInput").on('input',auto_complete);
        $("#destinationInput").on('input',auto_complete);
    });
    $("#featuredDeals").load(`${views_path}/flight.html`);
    $("#formContainer").load(`${views_path}/loginform.html`,x=> {
        $("#login-submit").on('click',login);
        $("#login-email-input").on('input',login_email_input_changed)
    });
    $("#registerContainer").load(`${views_path}/registerform.html`,x=>{
        $("#register-submit").on('click',register);
        $("#register-email-input").on('input',register_email_input_changed);
    });
    $("#addFlightFormContainer").load(`${views_path}/addFlightForm.html`,x=>{
        $("#add-flight-btn").on('click',addFlight);
        addFlightInitiaizeFormFields();
    });
    $("#addLocationFormContainer").load(`${views_path}/addLocationForm.html`,x=>{
        $("#add-location-submit").on('click',addLocation);
    });
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

});