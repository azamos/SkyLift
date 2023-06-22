
const login = e => {
    let email = $("#login-email-input").val();
    let password = $("#login-password-input").val();
    fetch(`${url}/users/?${new URLSearchParams({email,password})}`).then(res=>console.log(res));
}