const allDeals = [];

const headers = new Headers({
    'Authorization': 'Guest',
    'Content-Type': 'application/json'
});
const state = {
    user: 'Guest',
    name: 'Guest',
    token: ""
}
let socket = null;

const url = `http://localhost:3000/api`;
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}
const views_path = "./components/views";



/**
 Equivalet to document.onload, Here we:
  1.load the HTML components("views") into the main HTML file,
  into "container divs", which are <div> elements meant to contain the components.
  
  2.request the following from the server:
    2.1. hot deals
    2.2. if user login was saved on cookie, we ask the server to bring the user's data,
         such as purchase history, and if he has any admin privileges.
         2.2.1. Of course, if admin credentials exits, show the admin interface.
        NOTE: if cookie exists, the cart data should be on it. Otherwise, we will also bring it from the server.
 */

const loadMainComponent = async componentStr => {
    $('#main-component-container').html('')
    if(componentStr=='login'){
        $('#popularDealsTOallFlight').text('Popular Deals');
        $('#main-component-container').load(`${views_path}/loginform.html`,x=> {
            $("#login-submit").on('click',login);
            $("#login-email-input").on('input',login_email_input_changed)
            //$("#login-email-input").attr('button', );
        });
    }
    if(componentStr=='register'){
        $('#popularDealsTOallFlight').text('Popular Deals');
        $('#main-component-container').load(`${views_path}/registerform.html`,x=> {
            $("#register-submit").on('click',register);
            $("#register-email-input").on('input',register_email_input_changed);
        });
    }

    //user search
    if(componentStr=="searchUsers"){
        $('#main-component-container').load(`${views_path}/searchUsers.html`,x=>{
            //TODO: add authorization for admin !!!!!!!!!!!!!!!!!
            bringAllUsers();
            $("#searchButton").on('click',search);
            $("#searchUser").on('input',search_user_input_changed);
        })
    }

    if (componentStr == "popularDeals") {
        $('#main-component-container').html('');
        $('#featuredDeals').html('');
        let deals_ids = allDeals.map(d=>d._id);
        socket.emit('unsubscribe flights', {socketId: socket.id ,featuredDeals:deals_ids})
        $('#popularDealsTOallFlight').text('Popular Deals');
        $("#featuredDeals").load(`${views_path}/flight.html`, async () => {
            /* brings hot deals, no need for authorization.Alternitavely, send authorization: Guest */
            let res = await fetch(`${url}/flights/popular`);
            res = await res.json();
            res.forEach((flightModelInstance, i) => {
                $("#featuredDeals").append(generateFlightHTML(flightModelInstance, i , true));
                allDeals.push(flightModelInstance);
            });
            deals_ids = allDeals.map(d=>d._id);
            socket.emit('watched flights', {socketId: socket.id ,featuredDeals:deals_ids})
        });
    }

    if (componentStr == "allFlights") {
        //unsubscribe flights first
        $('#main-component-container').html('');
        let deals_ids = allDeals.map(d=>d._id);
        socket.emit('unsubscribe flights', {socketId: socket.id ,featuredDeals:deals_ids})
        $('#popularDealsTOallFlight').text('All Flights');
        $('#featuredDeals').load(`${views_path}/allFlights.html`, async ()=>{
            let res = await fetch(`${url}/flights`);
                res = await res.json();
                res.forEach((flightModelInstance, i) => {
                    $("#featuredDeals").append(generateFlightHTML(flightModelInstance, i , false));
                    allDeals.push(flightModelInstance);
                });
                let deals_ids = allDeals.map(d=>d._id);
                socket.emit('watched flights', {socketId: socket.id ,featuredDeals:deals_ids})
                //socket.emit('watched flights', {socketId: socket.id ,featuredDeals})
        })
    }

    if(componentStr=="cart"){
        $('#popularDealsTOallFlight').text('Popular Deals');
        $('#main-component-container').load(`${views_path}/cart.html`,x=>{
            if(state.user != 'Guest'){
                $("#purchaseButton").on('click',checkout_flights);
            }
            else {
                $("#purchaseButton").on('click', () => {
                    alert('You must be logged in to purchase flights');
                    loadMainComponent('login');
                });
            }
        })
    }

    if(componentStr=="addFlight"){
        $('#popularDealsTOallFlight').text('Popular Deals');
        $('#main-component-container').load(`${views_path}/addFlightForm.html`,x=>{
            $("#add-flight-btn").on('click',addFlight);
            addFlightInitiaizeFormFields();
        })
    }

    if(componentStr == "addLocation"){
        $('#popularDealsTOallFlight').text('Popular Deals');
        $('#main-component-container').load(`${views_path}/addLocationForm.html`,x=>{
            $("#add-location-submit").on('click',addLocation);
        });
    }

    if (componentStr == "welcomeMsg") {
        $('#main-component-container').load(`${views_path}/welcomeMsg.html`, x => {
            $('#user-welcome-span').text('welcome back ' + state.name);
        });
    }

    if (componentStr == "welcomeMsgForRegister") {
        $('#main-component-container').load(`${views_path}/welcomeMsg.html`, x => {
            if (state.name == 'Guest') {
                $('#user-welcome-span').text('welcome ' + state.user);
            }
            $('#user-welcome-span').text('welcome ' + state.name);
        });
    }
    
    if(componentStr == "userpage"){
        $('#popularDealsTOallFlight').text('Popular Deals');
        $('#main-component-container').load(`${views_path}/userpage.html`,x=>{
            if(state.user != 'Guest'){
                loadUserData(state.user)
            }
        });
    }

    if (componentStr == "errorMsg") {
        $('#main-component-container').load(`${views_path}/errorMsg.html`, () => {
            $('#error-span').text('An Error Occoured');
        })
    }
    if(componentStr == "whishlist"){
        $('#popularDealsTOallFlight').text('Popular Deals');
        $('#main-component-container').load(`${views_path}/wishlist.html`,()=>{
            addFlightWishlistInitiaizeFormFields(state.user);
            addWishlistFlight();
            $('#removeWishlistX').click(function () {
                $('#WishlistToRemove').remove();
            });
        })
    }
    if(componentStr == "mporeInfo"){
        $('#main-component-container').load(`${views_path}/moreInfo.html`,x=>{
            
        })
    }


}

$(async function () {
    //LOADING VIEW COMPONENTS INTO index.html, and attaching their relevant event handlers, defined in components/scripts
    $("#searchbarContainer").load(`${views_path}/searchbar.html`, x => {
        $("#navSubmit").on('click', searchFlight);
        $("#destination-dropdown").hide();//hide dropdown
        $("#origin-dropdown").hide();//hide dropdown
        $("#originInput").on('input', auto_complete);
        $("#destinationInput").on('input', auto_complete);
    });
    socket = io();
    socket.on('chat message', msg => console.log(msg))
    loadMainComponent('popularDeals');
    

    /**
     * the bellow function is self activated, it will bring the relevant deals from the server and then generate html for each flight.
     */


});