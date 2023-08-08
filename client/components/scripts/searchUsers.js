const search = e => {
    let email = $("#searchUser").val();
    fetch(`${url}/users/searchUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify({email})
    })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if (!res.error) {
                $("#searchUser").val("");
            }
        })
        .catch(err => console.log(err));
}

const search_user_input_changed = e => {
    const current_value = $("#searchUser").val();
    if (emailSyntaxIsValid(current_value)) {
        $("#searchButton").removeAttr('disabled');
    }
    else {
        $("#searchButton").attr('disabled', true);
    }
}