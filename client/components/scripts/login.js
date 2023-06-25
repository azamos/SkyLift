
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