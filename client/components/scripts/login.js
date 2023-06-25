
const login = e => {
    let email = $("#login-email-input").val();
    let password = $("#login-password-input").val();
    fetch(`${url}/users/checkuser`,{
        method:'POST',
        headers:{
            'Content-Type':'Application/json',
        },
        body:JSON.stringify({email,password})
    })
    .then(res=>res.json())
    .then(res=>console.log(res))
    .catch(err=>console.log(err));
}

const login_email_input_changed = e => {
    const current_value = $("#login-email-input").val();
    if(emailSyntaxIsValid(current_value)){
        $("#login-submit").removeAttr('disabled');
    }
    else{
        $("#login-submit").attr('disabled',true);
    }
}