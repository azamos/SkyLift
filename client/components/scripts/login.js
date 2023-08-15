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