const searchFlight = async e => {
    e.preventDefault();//DO NOT REMOVE, OTHERWISE WILL REFRESH
    const destinationSearchInput = $("#destinationInput").val();
    const originSearchInput = $("#originInput").val();
    const departureDateSearchInput = $("#departureDate").val();
    const arrivalDateSearchInput = $("#arrivalDate").val();
    if (destinationSearchInput == "" || originSearchInput == "" || departureDateSearchInput == "" || arrivalDateSearchInput == "") {
        alert("Please fill all fields");
        return;
    }
    //console.log(destinationSearchInput,originSearchInput,departureDateSearchInput,arrivalDateSearchInput);
    const searchResultArray = await fetch(`${url}/flights/searchFlight`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            destination: destinationSearchInput,
            origin: originSearchInput,
            depart: departureDateSearchInput,
            arrival: arrivalDateSearchInput
        })
    }).then(res => res.json())
        .then(res => {
            $("#main-component-container").html("");
            res.forEach(f => {
                const flight = generateFlightHTML(f, 0, true);
                $('#main-component-container').append(flight);
            })
        })
        .catch(e => { console.error(e); return []; });
}

let autocomplete_timer = null;//a variable used to avoid sending an autocomplete request to the server every milisecond 

//Will be the on input event handler for the cityName field in the addLocationForm.html
const auto_complete = e => {
    /* Explanation: Let's say someone wants to search for location: Jerusalem. The input field will look like this, after each
    consecutive letter is pressed: J, Je, Jer, Jeru, Jerus, Jerusa, Jerusal, Jerusale, Jerusalem.
    The autocomplete start only from 3 letters onwards. Now, if you type fast enough, each letter pressed will initiate this function, and thus
    sent an autocomplete request to the server. That means, if we get to Jeru and then stop typing(in order to get an autocomplete suggestion),
    the previous request for autocompletion of Jer might still not have been completed,
    thus autucomplete_timer is NOT NULL. So, we can kill it, since now a new autocomplete request has been made. */
    if (autocomplete_timer) {
        clearTimeout(autocomplete_timer);//Cancel previous key stroke autocomplete http request
    }
    if (e.target.value.trim() == "") {
        /* clearing previous suggestions from the relevant autocomplete dropdowns */
        if (e.target.id == "destinationInput") {
            $("#destination-dropdown").html("");
        }
        if (e.target.id == "originInput") {
            $("#origin-dropdown").html("");
        }
        return;
    }
    if (e.target.value.trim().length < 3) {
        //HIDING THE EMPTY DROPDOWN
        if (e.target.id == "destinationInput") {
            $("#destination-dropdown").hide();
        }
        if (e.target.id == "originInput") {
            $("#origin-dropdown").hide();
        }
        return;
    }
    /* the timer of 300 miliseconds bellow, in conjuction with the if(autocomplete_timer) check at the start of the function,
    serve as a means to fire less autocomplete requests to the server, in case of consecutive key strokes*/
    autocomplete_timer = setTimeout(() => fetch_autocomplete_suggestions(e.target.value, e.target.id), 300);
}
const set_destinationInput = str => $("#destinationInput").val(str);
const set_originInput = str => $("#originInput").val(str);

function fetch_autocomplete_suggestions(partial_string, id) {
    /* no need for authorization here */
    fetch(`${url}/locations/${partial_string}`)
        .then(res => res.json())
        .then(res => {
            if (id == "destinationInput") {
                //First, remove previous autocomplete results
                $("#destination-dropdown").html("");
                if (res.length == 0) {
                    $("#destination-dropdown").hide();
                    return;
                }
                res.forEach(x => {
                    const newValue = `${x.airport} ${x.international ? 'international' : ''} Airport,${x.cityName},${x.country}`
                    $("#destination-dropdown")
                        .append($(`<li><a class="dropdown-item">${newValue}</a></li>`)
                            .on('click', () => set_destinationInput(newValue)))
                });
                $("#destination-dropdown").show();
            }
            if (id == "originInput") {
                //First, remove previous autocomplete results
                $("#origin-dropdown").html("");
                if (res.length == 0) {
                    $("#origin-dropdown").hide();
                    return;
                }
                res.forEach(x => {
                    const newValue = `${x.airport} ${x.international ? 'international' : ''} Airport,${x.cityName},${x.country}`
                    $("#origin-dropdown")
                        .append($(`<li><a class="dropdown-item">${newValue}</a></li>`)
                            .on('click', () => set_originInput(newValue)))
                });
                $("#origin-dropdown").show();
            }
        })
        .catch(err => console.log(err))/*this catch clause will catch an error thrown anywhere in the fetch.then flow */
}