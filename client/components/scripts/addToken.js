const loadTokens = async () => {
    fetch(`${url}/tokens/tokenList`,{})
    .then(res=>res.json())
    .then(res=>{
        if(res.error){
            return;
        }
        res.forEach(tokenModelInstanc => {
            let htmlRef  = generateTokenHTML(tokenModelInstanc);
            $('#all-tokens-container').append(htmlRef);
        });
    })
    .catch(err=>console.log(err));
}