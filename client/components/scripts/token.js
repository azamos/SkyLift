const generateTokenHTML = (tokenModelInstanc) =>{
    console.log(tokenModelInstanc);
    let htmlRef = $("#card-token-template").clone();
    
    htmlRef.children('.d-flex').children('.flex-grow-1').children('.card-body-tokens').children('.card-title-token-id').text("Token ID = " + `${tokenModelInstanc._id}`);
    htmlRef.children('.d-flex').children('.flex-grow-1').children('.card-body-tokens').children('.card-text-user').text("User = "`${tokenModelInstanc.user}`);
    htmlRef.children('.d-flex').children('.flex-grow-1').children('.card-body-tokens').children('.card-text-authorization').text(`Authorization -  ${tokenModelInstanc.authorization}`);
    htmlRef.children('.d-flex').children('.flex-grow-1').children('.card-body-tokens').children('.expired').text(`Expired -  ${tokenModelInstanc.expired}`);
    //htmlRef.children('.card-head').children('.card-img-location').attr('src',locationModelInstanc.imageUrl);
    
    htmlRef.children('.card-head').children('.btn-outline-danger-token').on('click',async()=>{
        

    });
    
    
    return htmlRef;
}
