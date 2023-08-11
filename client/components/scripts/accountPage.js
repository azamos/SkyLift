function loadUserData (email_in) {
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
                $("#searchUser-input").val("");
                $('#main-component-container').load(`${views_path}/userpage.html`,()=>{
                    $('#userName').text(res.email);
                    $('#userEmail').text(res.display_name);
                    $('#totalMiles').text(res.total_miles);
                    $('#futureDealsSum').text(res.future_flights.length);
                    $('#pastFlights').text(res.past_flights.length);
                    $('#cartSum').text(res.cart.length);  
                })
            }
        })
        .catch(err => console.log(err));
}
