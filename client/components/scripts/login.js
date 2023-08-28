/*
    loginform and login should only be available in the case that the token generated after registering is expired
 */
const login = e => {
    let email = $("#login-email-input").val();
    let password = $("#login-password-input").val();
    if(email == state.user){
        alert("YOU ARE ALREADY LOGGED IN");
        loadMainComponent('popularDeals');
        return;
    }
    fetch(`${url}/users/checkuser`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password})
    })
        .then(res => res.json())
        .then(res => {
            afterLogin(res);
        })
        .catch(err => console.log(err));
}

const login_email_input_changed = e => {
    const current_value = $("#login-email-input").val();
    if (emailSyntaxIsValid(current_value)) {
        $("#login-submit").removeAttr('disabled');
    }
    else {
        $("#login-submit").attr('disabled', true);
    }
}

// res = email, full_name and isAdmin (3)
const afterLogin = (res) =>{
    if (!res.error) {
        $("#login-email-input").val("");
        $("#login-password-input").val("");
        $("#userIdentitySpan").text(`User: ${res.name}`).css('background-color','green');
        state.user = res.email;
        state.name = res.name;
        if(res.isAdmin){
            $('#addFlight-dropdown').show();
            $('#addLocation-dropdownMenu').show();
            $('#searchUsers-dropdown').show();
            $('#arbitrary-requirements-dropdownMenu').show();
            $('#allFlights-dropdownMenu').show();
        }
        loadMainComponent('welcomeMsg');

        //LOGOUT BUTTON functionality
        $("#logoutButton").show();
        $("#logoutButton").on('click',function(){
            state.user = 'Guest';
            state.name = 'Guest';
            fetch(`${url}/users/signout`, {
                method: 'GET',
                headers
            })
            $("#userIdentitySpan").text(`User: ${state.user}`).css('background-color','black');
            $("#logoutButton").hide();
            $('#searchUsers-dropdown').hide();
            $('#addFlight-dropdown').hide();
            $('#addLocation-dropdownMenu').hide();
            $('#allFlights-dropdownMenu').hide();
            $('#arbitrary-requirements-dropdownMenu').hide();
            loadMainComponent('popularDeals');
        });
        
    }
    else {
        alert(res.error);
    }
}