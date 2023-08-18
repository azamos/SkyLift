const generateUserHTML = (UserModelInstance,i) =>{
    let htmlRef = $("#allusers-template").clone();
    htmlRef.attr('style',"background-color: rgb(224, 224, 217)");
    //change id to user email - to make it unique
    htmlRef.attr('id',`${email}`);
    let userHeader = htmlRef.children('.user-header');
    userHeader.children('#fullName-allusers').text(`User Name:  ${UserModelInstance.full_name}`)
    content.children('#phoneNumber-allusers').text(`Phone Number: ${UserModelInstance.phone_number}`)
    userHeader.children('#email-allusers').text(`Email: ${UserModelInstance.email}`)
    userHeader.children('#miles-allusers').text(`Miles: ${UserModelInstance.total_miles}`)
    let content = htmlRef.children('.content');
    content.children('#pastFlights-allusers').text(`Past Flights: ${UserModelInstance.past_flights.length}`)
    content.children('#future_flights').text(`Future Flights: ${UserModelInstance.future_flights.length}`)
    content.children('#cart').text(`Cart: ${UserModelInstance.cart.length}`)
    
    //WORK ON THIS
    htmlRef.children('.card-body').children('#moreInfo-allusers').on('click',function(){
    
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
                    $('#pastFlights-allusers').append(temp);   
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
                    $('#cart-allusers').append(temp);
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
                    $('#future_flights-allusers').append(temp);
                })
            });

        }).catch(err => {console.log(err);})
        
    });
return htmlRef;
}