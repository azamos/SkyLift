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
                    $('#useraccount-phonenumber').text("0" + res.user.phone_number);
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
                    //TODO -- TOFIX this !! 
                    $(".circle-edit").on('click',()=>{
                        $('#main-component-container').load(`${views_path}/reconfirmPassword.html`,async()=>{
                            let tempPass = $('#passwordInput-foredit').val();
                            
                            fetch(`${url}/users/checkpassword`, {
                                method: 'POST',
                                headers,
                                body: JSON.stringify({email,tempPass})
                            })
                            .then(res => res.json())
                            .then(res => {
                                if(res.msg){
                                    $('#main-component-container').load(`${views_path}/editUserInfoComp.html`,async()=>{
                                        const name = $('#fullName-editinfo');
                                        const phone = $('#phoneNumber-editinfo');
                                        const password = $('#password-editinfo');
                                        const confirmPassword = $('#confirmPassword-editinfo');
                                        if(password != confirmPassword){
                                            alert("Passwords do not match");
                                            return;
                                        }
                                        fetch(`${url}/users/update`, {
                                            method: 'POST',
                                            headers,
                                            body: JSON.stringify({email:email , newData: {full_name:name , phone_number:phone , password:password}})
                                        })
                                        .then(res => res.json())
                                        .then(res => {
                                            if(res.error){
                                                alert(res.error);
                                                return;
                                            }
                                            alert("User info updated");
                                            loadMainComponent('userpage');
                                        })
                                        .catch(err => console.log(err));
                                    });
                                }
                            })
                            .catch(err => console.log(err));
                        });
                });
                    

                //here it will load the data for future past and cart
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
                                loadMainComponent('userpage');
                            })
                        })
                    })
                }
                
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
                                loadMainComponent('userpage');
                            })
                        })
                    })
                }
                 
                if(res.cart.length!=0){
                    $("#cart-button-acc").attr('style', 'background-color: blue');
                    $("#cart-button-acc").on('click',()=>{
                            loadMainComponent('cart');
                        });
                }            
            })
        }
            
    })
        .catch(err => console.log(err));
}
