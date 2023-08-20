const bringAllUsers = async() => {
    $('#allusers-textop').text('All Users');
    fetch(`${url}/users/usersList`, {
        method: 'GET',
        headers
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        if(!res.error){
            res.forEach(user => {
                let htmlRef = generateUserHTML(user , user.length);
                $('#all-users-container').append(htmlRef);
            });
        }
    }).catch(err => {console.log(err);});    
}