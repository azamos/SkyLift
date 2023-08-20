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
            if (!res.error) {
                $("#login-email-input").val("");
                $("#login-password-input").val("");
                $("#userIdentitySpan").text(`User: ${res.name}`).css('background-color','green');
                headers.set('Authorization',res.token);
                state.user = res.email;
                state.name = res.name;
                state.token = res.token;
                loadMainComponent('welcomeMsg');

                //ADMIN check!
                fetch(`${url}/users/getUserData`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({email:state.user})
                })
                .then(resu => resu.json())
                .then(resu => {
                    if(resu.user.isAdmin){
                        $('#addFlight-dropdown').show();
                        $('#addLocation-dropdownMenu').show();
                        $('#searchUsers-dropdown').show();
                    }
                })
                .catch(err => {console.log(err);})

                //LOGOUT BUTTON functionality
                $("#logoutButton").show();

                $("#logoutButton").on('click',function(){
                    state.user = 'Guest';
                    state.name = 'Guest';
                    state.token = "";
                    fetch(`${url}/users/signout`, {
                        method: 'GET',
                        headers
                    })
                    $("#userIdentitySpan").text(`User: ${state.user}`).css('background-color','black');
                    $("#logoutButton").hide();
                    $('#searchUsers-dropdown').hide();
                    $('#addFlight-dropdown').hide();
                    $('#addLocation-dropdownMenu').hide();
                    loadMainComponent('popularDeals');
                });
                
            }
            else {
                alert(res.error);
            }
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