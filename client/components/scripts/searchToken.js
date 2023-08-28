const searchToken = () => {
    const serchUserInput = $("#searchTokens-input").val();
    if (serchUserInput == "") {
        alert("Please fill all fields");
        return;
    }

    fetch(`${url}/tokens/getTokenById`,{
        method:'POST',
        headers,
        body: JSON.stringify({token_id:serchUserInput})
    })
    .then(res=>res.json())
    .then(res=>{
        const htmlRef = generateTokenHTML(res);
        $('#searchTokenVisual').append(htmlRef);
    
    })
    .catch(err => {console.log(err);})
    
    
}
