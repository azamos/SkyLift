const search = e => {
    let email = $("#searchUser-input").val();
    if(!isValidEmail(email)){
        alert("Please enter a valid email address.");
        return;
    }
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

                if(futureFlights.length!=0){
                    $("#allfutureflights-button").attr('style', 'background-color: #5f9ea0');
                    $("#allfutureflights-button").on('click',()=>{
                        $('#main-component-container').load(`${views_path}/allFlightsTamp.html`,()=>{
                            
                            for(let i = 0; i<futureFlights.length; i++){
                                const flight = generateMoreInfoFlightHTML(futureFlights[i]);
                                $('#all-flights-info').append(flight);
                            }
                            $('#putNameHere').text('Future Flights');
                            $('#go-back-btn-allflights').on('click',()=>{
                                loadMainComponent('searchUsers');
                            })
                        })
                })}
                
                if(pastFlights.length!=0){
                    $("#allpastflights-button").attr('style', 'background-color: blue');
                    $("#allpastflights-button").on('click',()=>{
                        $('#main-component-container').load(`${views_path}/allFlightsTamp.html`,()=>{
                            for(let i = 0; i<pastFlights.length; i++){
                                const flight = generateMoreInfoFlightHTML(pastFlights[i]);
                                $('#all-flights-info').append(flight);
                            }
                            $('#putNameHere').text('Past Flights');
                            $('#go-back-btn-allflights').on('click',()=>{
                                loadMainComponent('searchUsers');
                            })
                        })
                })}
                 
                if(res.cart.length!=0){
                    $("#cart-button-acc").attr('style', 'background-color: blue');
                    $("#cart-button-acc").on('click',()=>{
                            loadMainComponent('cart');
                        })
                    }
                })
            }
            
    })
        .catch(err => console.log(err));
}

const search_user_input_changed = e => {
    const current_value = $("#searchUser-input").val();
    if (emailSyntaxIsValid(current_value)) {
        $("#searchButton").removeAttr('disabled');
    }
    else {
        $("#searchButton").attr('disabled', true);
    }
}

function isValidEmail(email) {
    // Basic email validation using a regular expression
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}