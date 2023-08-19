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
    
    //WORK ON THIS
    userHeader.children('.button-group').children('.moreInfo-allusers').on('click',function(){
        $('#main-component-container').load(`${views_path}/moreInfo.html`,x=>{
            $(".btn-gobacktosearchuser").on('click',()=>{
                loadMainComponent('searchUsers');
            });
            fetch(`${url}/users/getUserData`, {
                method: 'POST',
                headers,
                body: JSON.stringify({email:UserModelInstance.email})
            })
            .then(res => res.json()
            ).then(res => {
                res.past_flights.forEach(flightToAdd => {
                    fetch(`${url}/flights/getFlightData`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({flightId:flightToAdd})
                    }).then(res => res.json()
                    ).then(res => {
                        let temp = generateFlightHTML(res, i , isAdmin);
                        $('.pastFlight-moreinfo').append(temp);   
                    })
                });
                res.cart.forEach(flightToAdd => {
                    fetch(`${url}/flights/getFlightData`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({flightId:flightToAdd})
                    }).then(res => res.json()
                    ).then(res => {
                        let temp = generateFlightHTML(res, i , isAdmin);   
                        $('.cart-moreinfo').append(temp);
                    })
                });
                res.future_flights.forEach(flightToAdd => {
                    fetch(`${url}/flights/getFlightData`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({flightId:flightToAdd})
                    }).then(res => res.json()
                    ).then(res => {
                        let temp = generateFlightHTML(res, i , isAdmin);   
                        $('.futureFlights-moreinfo').append(temp);
                    })
                });
    
            }).catch(err => {console.log(err);})
        });
    });
return htmlRef;
}