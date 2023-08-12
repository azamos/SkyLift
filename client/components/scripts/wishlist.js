function addFlightWishlistInitiaizeFormFields(email_in) {
    let userWishlist=[];
    let email = state.user;
    fetch(`${url}/users/getUserData`, {
        method: 'POST',
        headers,
        body: JSON.stringify({email})
    })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if (!res.error) {
                userWishlist = res.wishlist;
            }
        })
        .catch(err => console.log(err));
const userWishlistLength = userWishlist.length;


let add_flight_wishlist_form_fields = [];

    for(let i=0; i<userWishlistLength; i++){
        const newFlightTitleJqueryObj = userWishlist[i].title;
        const newFlightPriceJqueryObj = userWishlist[i].price;
        const newFlightCompanyJqueryObj = userWishlist[i].company;
        const newFlightOriginJqueryObj = userWishlist[i].origin;
        const newFlightDestinationJqueryObj = userWishlist[i].destination;
        const newFlightdepartTimeJqueryObj = userWishlist[i].departTime;
        const newFlightEstimatedTimeOfArrivalJqueryObj = userWishlist[i].estimatedTimeOfArrival;
        add_flight_form_fields[i] = {
            newFlightTitleJqueryObj, newFlightPriceJqueryObj, newFlightCompanyJqueryObj,
            newFlightOriginJqueryObj, newFlightDestinationJqueryObj, newFlightdepartTimeJqueryObj,
            newFlightEstimatedTimeOfArrivalJqueryObj
        }
        /* adding change-event-listeners to all of the form fields */
        Object.values(add_flight_form_fields[i]).forEach(jQueryObj => jQueryObj.on('change', validate_add_flight_form));
    }
}

const addWishlistFlight = async e => {
    for(let i=0; userWishlistLength; i++){
        const { newFlightTitleJqueryObj,
            newFlightPriceJqueryObj,
            newFlightCompanyJqueryObj,
            newFlightOriginJqueryObj,
            newFlightDestinationJqueryObj,
            newFlightdepartTimeJqueryObj,
            newFlightEstimatedTimeOfArrivalJqueryObj } = add_flight_form_fields[i];

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
        let newlyAddedFlight = userWishlist[i];
        newlyAddedFlight = await newlyAddedFlight.json();
        if(newlyAddedFlight.error){
            console.log(newlyAddedFlight.error);
            return;
        }
        if (newlyAddedFlight) {//if flight was succesfuly added to the database:
            /* first, generate the html component for the new flight */
            generateFlightHTML(newlyAddedFlight, featuredDeals.length);
            /* next, add it to the list of flights */
            featuredDeals.push(newlyAddedFlight);
        }
        else {
            console.log(`failed to add flight. reason: ${newlyAddedFlight}`);
        }
        //Lastly, reseting the form fields
        Object.values(add_flight_form_fields[i]).forEach(jQueryObj=>jQueryObj.val(""));
    }
}

