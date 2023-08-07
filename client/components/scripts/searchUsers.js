async function searchUsers() {
    let searchUserInput = $('#searchUser').val();
    
    if(searchUserInput.trim() != ""){
        // const response = await fetch(`${url}/users/searchUser/?` + new URLSearchParams({
        // email:searchUserInput
        // }))
        // const results = await response.json();
         
        fetch(`${url}/users/searchUser/?`, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
            },
            body: JSON.stringify({ email })
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (!res.error) {
                    $("#searchUserInput").val("");
                }
            })
            .catch(err => console.log(err));
    }
    else{
        console.log("not valid input");
    }
}