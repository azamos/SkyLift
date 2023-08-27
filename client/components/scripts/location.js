const generateLoctionHTML = (locationModelInstanc) =>{
    let htmlRef = $("#location-template").clone();
    
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-title-country-name').text(`${locationModelInstanc.country}`);
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-city-city-name').text(`${locationModelInstanc.cityName}`);
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-text-airport').text(`Airport -  ${locationModelInstanc.airport}`);
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-text-international').text(`International -  ${locationModelInstanc.international}`);
    //htmlRef.children('.card-head').children('.card-img-location').attr('src',locationModelInstanc.imageUrl);
    
    htmlRef.children('.card-head').children('.btn-outline-danger').on('click',async()=>{
        

    });
    
    
    return htmlRef;
}
