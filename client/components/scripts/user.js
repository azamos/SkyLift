const generateUserHTML = (UserModelInstance,i) =>{
    let htmlRef = $("#allusers-template").clone();
    htmlRef.attr('style',"background-color: rgb(224, 224, 217)");
    //
    let userHeader = htmlRef.children('.card').children('.card-body');
    userHeader.children('.fullName-allusers').text(`User Name:  ${UserModelInstance.full_name}`)
    userHeader.children('.phoneNumber-allusers').text(`Phone Number: 0${UserModelInstance.phone_number}`)
    userHeader.children('.email-allusers').text(`Email: ${UserModelInstance.email}`)
    userHeader.children('.miles-allusers').text(`Miles: ${UserModelInstance.total_miles}`) 
    userHeader.children('.place-holder-flights-info').children('.pastFlights-allusers').text(`Past Flights: ${UserModelInstance.past_flights.length}`)
    userHeader.children('.place-holder-flights-info').children('.futureFlights-allusers').text(`Future Flights: ${UserModelInstance.future_flights.length}`)
    userHeader.children('.place-holder-flights-info').children('.cart-allusers').text(`Cart: ${UserModelInstance.cart.length}`)
    


    //TODO --- WORK ON THIS
    userHeader.children('.button-group').children('.moreInfo-allusers').on('click',function(){
        $('#main-component-container').load(`${views_path}/moreInfo.html`,x=>{
            

            //this button send you back to search user page
            $(".gobacktosearchuser").on('click',()=>{
                loadMainComponent('searchUsers');
            });

            fetch(`${url}/users/getUserData`, {
                method: 'POST',
                headers,
                body: JSON.stringify({email:UserModelInstance.email})
            })
            .then(res => res.json())
            .then(res => {
                res.past_flights.forEach(flightToAdd => {
                    let temp = generateMoreInfoFlightHTML(flightToAdd);
                    $('.pastFlight-moreinfo').append(temp);  
                });
                res.cart.forEach(flightToAdd => {
                    let temp = generateMoreInfoFlightHTML(flightToAdd);   
                    $('.cart-moreinfo').append(temp);
                });
                res.future_flights.forEach(flightToAdd => {
                    let temp = generateMoreInfoFlightHTML(flightToAdd);  
                    $('.futureFlights-moreinfo').append(temp);
                });
                
                //this will add the count of flights in the more-info user page
                $('.futureflightinfo').text(`Future Flights: ${res.future_flights.length}`)
                $('.cartinfo').text(`Cart: ${res.cart.length}`)
                $('.pastflightsinfo').text(`Past Flights: ${res.past_flights.length}`)
            })
            .catch(err => {console.log(err);})

            
        });
    });
return htmlRef;
}


const generateMoreInfoFlightHTML = (flightModelInstance) => {
    let htmlRef = $("#flight-template").clone();
    htmlRef.attr('style',"background-color: rgb(224, 224, 217);");
    htmlRef.children('.destination-photo').attr('src',`./images/destination/${camelize(flightModelInstance.destination)}.jpg`)
    htmlRef.attr('style',`margin-top: 10px;`);
    let flightHeader = htmlRef.children('.flight-header');
    flightHeader.children('.price').text(`PRICE: ${flightModelInstance.price}$`)
    flightHeader.children('.flight-title').text(`FLIGHT NUMBER:  ${flightModelInstance.title}`)
    let content = htmlRef.children('.content');
    content.children('.origin').text(`From: ${flightModelInstance.origin}`)
    content.children('.destination').text(`To: ${flightModelInstance.destination}`)
    content.children('.departure').text(`Departing: ${flightModelInstance.departTime}`)
    content.children('.arrival').text(`ETA: ${flightModelInstance.estimatedTimeOfArrival}`)
    htmlRef.children('.card-body').children('.buy-button').remove();
    htmlRef.children('.card-body').children('.wishlist-button').remove();
    return htmlRef; 
}