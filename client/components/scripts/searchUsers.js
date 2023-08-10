const search = e => {
    let email = $("#searchUser-input").val();
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
                    $('#userEmail').text(state.display_name);
                    $('#totalMiles').text(res.total_miles);
                    $('#futureDealsSum').text("1");
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