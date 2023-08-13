
const register = e => {
    let register_full_name = $("#register-full-name-input").val();
    let register_phone_number = $("#register-phone-number-input").val();
    let register_email = $("#register-email-input").val();
    let register_password = $("#register-password-input").val();
    //confirm-register-password-input
    let register_confirmed_password = $("#confirm-register-password-input").val();
    
    if(register_password!=register_confirmed_password){
        alert("Passwords do not match!");
        return;
    }
    
    if(!phoneNumberValidation(register_phone_number)){
        alert("Phone number is not valid!");
        return;
    }

    if(!checkFullName(register_full_name)){
        alert("Full name is not valid!");
        return;
    }
    
    fetch(`${url}/users`,{
        method:'POST',
        headers,
        body:JSON.stringify({'email':register_email,'password':register_confirmed_password,'full_name':register_full_name ,'phone_number':register_phone_number})
    })
    .then(res=>res.json())
    .then(res=>{
        if(res.error){
            loadMainComponent('errorMsg');
            return;
        }
        state.user = register_email;
        headers.set('Authorization',res.token);
        if(register_full_name == ""){
            $("#userIdentitySpan").text(`User: ${register_email}`);
            state.name = register_email;
        }
        else {
            state.name = register_full_name;
            $("#userIdentitySpan").text(`User: ${register_full_name}`);
        }
        loadMainComponent('welcomeMsgForRegister');
    })
    .catch(err=>console.log(err))
    .finally(()=>{
        $("#register-full-name-input").val("");
        $("#register-phone-number-input").val("");
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

function phoneNumberValidation(inputNumber){
    let number = inputNumber.toString();
    let digits = number.length;
    if(digits == 10 || digits == 0){
        return true;
    }
    return false;
}

function checkFullName(inputString) {
if(inputString == ""){
    return true;
}
// Remove leading and trailing spaces
inputString = inputString.trim();

// Check if the input is empty after trimming
if (inputString === "") {
    return false;
}

// Split the input string into words
var words = inputString.split(/\s+/);

// Check if there are at least two words
if (words.length < 2) {
    return false;
}

// Check if each word has at least two letters
for (var i = 0; i < words.length; i++) {
    if (words[i].length < 2) {
        return false;
    }
}

return true;
}
