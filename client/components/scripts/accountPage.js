function loadUserData (email_in) {
    let email = state.user;
    fetch(`${url}/users/getUserData`, {
        method: 'POST',
        headers,
        body: JSON.stringify({email})
    })
        .then(res => res.json())
        .then(res => {
            if (!res.error) {
                $("#searchUser-input").val("");
                $('#main-component-container').load(`${views_path}/userpage.html`,()=>{
                    $('.username-account').text(res.user.full_name);
                    $('#useraccount-email').text(res.user.email);
                    $('#totalMiles-account').text(res.user.total_miles);
                    $('#futureDealsSum').text(res.future_flights.length);
                    $('#pastFlights').text(res.past_flights.length);
                    $('#cartSum').text(res.cart.length);
                    
                    const futureFlights = res.future_flights;
                    for(let i = 0; i<futureFlights.length && i<3; i++){
                        const flight = generateMoreInfoFlightHTML(futureFlights[i]);
                        $('.future-flight-list').append(flight);
                    }
                    const pastFlights = res.past_flights;
                    for(let i = 0; i<pastFlights.length && i<3; i++){
                        const flight = generateMoreInfoFlightHTML(pastFlights[i]);
                        $('.past-flight-list').append(flight);
                    }

                    $("#allfutureflights-button").on('click',()=>{
                        $('#main-component-container').load(`${views_path}/allFlightsTamp.html`,()=>{
                            for(let i = 0; i<futureFlights.length; i++){
                                const flight = generateMoreInfoFlightHTML(futureFlights[i]);
                                $('#allfutureflights').append(flight);
                            }
                            $('#putNameHere').text('Future Flights');
                            $('#go-back-btn-allflights').on('click',()=>{
                                loadMainComponent('userpage');
                            })
                        })
                    })

                    $("#allpastflights-button").on('click',()=>{
                        $('#main-component-container').load(`${views_path}/allFlightsTamp.html`,()=>{
                            for(let i = 0; i<pastFlights.length; i++){
                                const flight = generateMoreInfoFlightHTML(pastFlights[i]);
                                $('#allfutureflights').append(flight);
                            }
                            $('#putNameHere').text('Past Flights');
                            $('#go-back-btn-allflights').on('click',()=>{
                                loadMainComponent('userpage');
                            })
                        })
                    })
                    $("#cart-button-acc").on('click',()=>{
                        loadMainComponent('cart');
                    })
                })
            }
            
    })
        .catch(err => console.log(err));
}
