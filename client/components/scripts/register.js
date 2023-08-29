
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
        if(register_full_name == ""){
            $("#userIdentitySpan").text(`User: ${register_email}`);
            state.name = register_email;
        }
        else {
            state.name = register_full_name;
            $("#userIdentitySpan").text(`User: ${register_full_name}`);
        }
        loadMainComponent('welcomeMsgForRegister');
        $("#logoutButton").show();
        $("#loginh-dropdown").hide();
        $("#register-dropdown").hide();
        $("#userIdentitySpan").css('background-color','green');
        loadMainComponent('popularDeals');

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

function phoneNumberValidation(phoneNumber) {
    // Remove spaces from the edges
    phoneNumber = phoneNumber.trim();
  
    // Remove hyphens
    phoneNumber = phoneNumber.replace(/-/g, '');
  
    // If the phone number is empty, it's considered valid
    if (phoneNumber.length === 0) {
      return true;
    }
  
    // Check if the phone number has a valid format
    if (!/^\+?\d{10,14}$/.test(phoneNumber)) {
      return false;
    }
  
    // If a country code is provided, it should be at the beginning
    if (phoneNumber.startsWith('+')) {
      const countryCode = phoneNumber.slice(1, 4); // Assuming country code is up to 3 digits
      if (!/^\d+$/.test(countryCode)) {
        return false;
      }
  
      // After the country code, there should be between 9 to 10 digits
      const remainingDigits = phoneNumber.slice(4);
      if (remainingDigits.length < 9 || remainingDigits.length > 10 || !/^\d+$/.test(remainingDigits)) {
        return false;
      }
    } else {
      // If no country code, there should be exactly 10 digits
      if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
        return false;
      }
    }
  
    // If all checks pass, the phone number is valid
    return true;
  }

  function formatFullName(inputString) {
    // Remove leading and trailing spaces
    inputString = inputString.trim();

    // Split the input string into words
    var words = inputString.split(/\s+/);

    // Format each word: capitalize first letter for Latin words, keep Hebrew words unchanged
    for (var i = 0; i < words.length; i++) {
        if (/^[A-Za-z]+$/.test(words[i])) { // Check if the word contains only Latin characters
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
        }
    }

    // Join the formatted words to create the formatted full name
    var formattedFullName = words.join(" ");

    return formattedFullName;
}

function checkFullName(inputString) {
    if (inputString == "") {
        return true; // Empty input is considered valid
    }

    // Check if the input contains only letters and spaces
    if (!/^[A-Za-z\s]+$/.test(inputString)) {
        return false;
    }

    // Format the full name
    var formattedFullName = formatFullName(inputString);

    // Check if the formatted full name follows the validation rules
    var words = formattedFullName.split(/\s+/);

    // Check if there are between 2 and 5 words
    if (words.length < 2 || words.length > 5) {
        return false;
    }

    // Check if each word has at least two letters
    for (var i = 0; i < words.length; i++) {
        if (words[i].length < 2) {
            return false;
        }
    }

    // Additional checks for specific characters or patterns could be added here

    return true;
}
