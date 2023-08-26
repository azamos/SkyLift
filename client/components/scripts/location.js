const generateLoctionHTML = (locationModelInstanc) =>{
    let htmlRef = $("#location-template").clone();
    
    htmlRef.attr('style',"background-color: rgb(224, 224, 217)");
    htmlRef.children('.card-body').children('#country-name').text(`Country: ${locationModelInstanc.country}`);
    htmlRef.children('.card-body').children('#cityName').text(`City Name: ${locationModelInstanc.cityName}`);
    htmlRef.children('.card-body').children('#airport').text(`Airport: ${locationModelInstanc.airport}`);
    htmlRef.children('.card-body').children('#international').text(`International: ${locationModelInstanc.international}`);
    htmlRef.children('.card-head').children('.card-img-location').attr('src',locationModelInstanc.imageUrl);
    
    htmlRef.children('.card-body').children('.btn-outline-danger').on('click',async()=>{
        

    });
    
    
    return htmlRef;
}
