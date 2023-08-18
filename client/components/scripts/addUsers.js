const bringAllUsers = async() => {
    $('#allusers-textop').text('All Users');
    const allUsers = await fetch(`${url}/users/usersList`, {
        method: 'GET',
    }).catch(err => console.log(err))
    .then(res => res.json())
    .then(res => {
        res.forEach(user => {
            let htmlRef = generateUserHTML(user,user.length);
            $('#main-component').append(htmlRef);
        });
    });    
}