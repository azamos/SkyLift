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
                    $('#userName').text(res.email);
                    $('#userEmail').text(state.display_name);
                    $('#totalMiles').text(res.total_miles);
                    $('#futureDealsSum').text(res);
                    $('#pastFlights').text("1");
                    $('#cartSum').text("1");  
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