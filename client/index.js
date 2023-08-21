const allDeals = [];

const headers = new Headers({
    'Content-Type': 'application/json'
});
const state = {
    user: 'Guest',
    name: 'Guest'
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
    $('#popularDealsTOallFlight').show();
    $('#featuredDeals').show();
    $('#main-component-container').html('')
 
    if(componentStr=='login'){
        $('#popularDealsTOallFlight').text('All Deals');
        $('#main-component-container').load(`${views_path}/loginform.html`,x=> {
            $("#login-submit").on('click',login);
            $("#login-email-input").on('input',login_email_input_changed)
        });
        
    }
    if(componentStr=='register'){
        $('#popularDealsTOallFlight').text('Popular Deals');
        $('#main-component-container').load(`${views_path}/registerform.html`,x=> {
            $("#register-submit").on('click',register);
            $("#register-email-input").on('input',register_email_input_changed);
        });
    }

   

    // if(componentStr == "moreInfo"){
    //     $('#main-component-container').load(`${views_path}/moreInfo.html`,x=>{
    //         bringAllUsers();
    //     })
    // }

     //user search
     if(componentStr=="searchUsers"){
        $('#main-component-container').html('');
        loadMainComponent('popularDeals');
        
        //hide popular deals and the text "alldeals/allflights"
        $('#popularDealsTOallFlight').hide();
        $('#featuredDeals').hide();
        
        $('#main-component-container').load(`${views_path}/searchUsers.html`,x=>{
            $('#all-users-container').load(`${views_path}/allUsers.html`,x=>{
                bringAllUsers();
            });
            $("#searchButton").on('click',search);
            $("#searchUser").on('input',search_user_input_changed);
        })
    }

    if (componentStr == "popularDeals") {
        $('#main-component-container').html('');
        $('#popularDealsTOallFlight').text('Popular Deals');
        $('#featuredDeals').html('');

        let deals_ids = allDeals.map(d=>d._id);
        socket.emit('unsubscribe flights', {socketId: socket.id ,featuredDeals:deals_ids})

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
        $('#popularDealsTOallFlight').text('All Flights');
        $('#featuredDeals').html('');

        let deals_ids = allDeals.map(d=>d._id);
        socket.emit('unsubscribe flights', {socketId: socket.id ,featuredDeals:deals_ids})
        
        $('#featuredDeals').load(`${views_path}/allFlights.html`, async ()=>{
                let res = await fetch(`${url}/flights`);
                res = await res.json();
                if(!(res instanceof Array)){
                    console.log('PROBLEM:')
                    return;
                }
                res.forEach((flightModelInstance, i) => {
                    $("#featuredDeals").append(generateFlightHTML(flightModelInstance, i , false));
                    allDeals.push(flightModelInstance);
                });
                let deals_ids = allDeals.map(d=>d._id);
                socket.emit('watched flights', {socketId: socket.id ,featuredDeals:deals_ids})
        })
    }

    if(componentStr=="cart"){
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
        if(state.user != 'Guest'){
            loadMainComponent('popularDeals');
            $('#popularDealsTOallFlight').text('Popular Deals');
            $('#main-component-container').load(`${views_path}/userpage.html`,x=>{
                if(state.user != 'Guest'){
                    loadUserData(state.user)
                }
            });
        }
        else {
            alert('You must be logged in to view your account');
            loadMainComponent('login');
        }
    }

    if (componentStr == "errorMsg") {
        $('#main-component-container').load(`${views_path}/errorMsg.html`, () => {
            $('#error-span').text('An Error Occoured');
        })
    }


   

    // if(componentStr == "whishlist"){
    //     $('#popularDealsTOallFlight').text('Popular Deals');
    //     $('#main-component-container').load(`${views_path}/wishlist.html`,()=>{
    //         addFlightWishlistInitiaizeFormFields(state.user);
    //         addWishlistFlight();
    //         $('#removeWishlistX').click(function () {
    //             $('#WishlistToRemove').remove();
    //         });
    //     })
    // }

}

$(async function () {
    //LOADING VIEW COMPONENTS INTO index.html, and attaching their relevant event handlers, defined in components/scripts
    $("#searchbarContainer").load(`${views_path}/searchbar.html`, x => {
        let destinationInput = $("#destinationInput").val();
        let originInput = $("#originInput").val();
        let departureDate = $("#departureDate").val();
        let arrivalDate = $("#arrivalDate").val();
        // console.log(destinationInput);
        // console.log(originInput);
        // console.log(departureDate);
        // console.log(arrivalDate);
        $("#navSubmit").on('click', function () {
            if (destinationInput == "" || originInput == "" || departureDate == "" || arrivalDate == "") {
                alert("Please fill all fields");
                return;
            }
            fetch(`${url}/flights/searchFlight`, {
            method: 'POST',
            headers,
            body: JSON.stringify({destinationInput,originInput,departureDate,arrivalDate})
            })
            .then(res => res.json())
            .then(res =>{
                const flight = generateFlightHTML(res, 0 , false);
                $('#underTheSearchBar').append(flight);
            })
        });

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

