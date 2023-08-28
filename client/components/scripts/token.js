const generateTokenHTML = (tokenModelInstanc) =>{
    let htmlRef = $("#card-token-template").clone();
    
    htmlRef.children('.d-flex').children('.flex-grow-1').children('.card-body-tokens').children('.card-title-token-id').text(`Token ID = ${tokenModelInstanc._id}`);
    htmlRef.children('.d-flex').children('.flex-grow-1').children('.card-body-tokens').children('.card-text-user').text(`User = ${tokenModelInstanc.user}`);
    htmlRef.children('.d-flex').children('.flex-grow-1').children('.card-body-tokens').children('.card-text-authorization').text(`Authorization -  ${tokenModelInstanc.authorization}`);
    htmlRef.children('.d-flex').children('.flex-grow-1').children('.card-body-tokens').children('.expired').text(`Expired -  ${tokenModelInstanc.expired}`);
    
    htmlRef.children('.d-flex').children('.flex-grow-1').children('.card-body-tokens').children('.div-3-1').children('.btn-outline-danger-token').on('click',async()=>{
        fetch(`${url}/tokens/deleteToken`,{
            method: 'POST',
            headers,
            body:JSON.stringify({token_id:tokenModelInstanc._id})
        })
        .then(res => res.json())
        .then(res =>{
            if(res.error){
                console.log(res.error);
                return;
            }
            loadMainComponent("searchUsers");
        })
        .catch(err => {console.log(err);})
    });
    
    
    return htmlRef;
}
