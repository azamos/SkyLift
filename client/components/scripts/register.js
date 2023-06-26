
const register = e => {
    console.log("asfasfasfasf")
    let register_email = $("#register-email-input").val();
    let register_password = $("#register-password-input").val();
    //confirm-register-password-input
    let register_confirmed_password = $("#confirm-register-password-input").val();
    if(register_password!=register_confirmed_password){
        alert("Passwords are a mismatch");
        return;
    }
    fetch(`${url}/users`,{
        method:'POST',
        headers:{
            'Content-Type':'Application/json',
        },
        body:JSON.stringify({'email':register_email,'password':register_confirmed_password})
    })
    .then(res=>res.json())
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
    .finally(()=>{
        $("#register-email-input").val("");
        $("#register-password-input").val("");
        $("#confirm-register-password-input").val("");
    });
}

const register_email_input_changed = e => {
    const current_value = $("#register-email-input").val();
    if(emailSyntaxIsValid(current_value)){
        $("#register-submit").removeAttr('disabled');
    }
    else{
        $("#register-submit").attr('disabled',true);
    }
}