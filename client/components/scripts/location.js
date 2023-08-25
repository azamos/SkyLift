const generateLoctionHTML = (locationModelInstanc) =>{
    console.log(locationModelInstanc);
    let htmlRef = $("#location-template").clone();
    
    htmlRef.attr('style',"background-color: rgb(224, 224, 217)");
    htmlRef.children('#location-details').children('.card').children('.card-body').children('#cityName').text(`City Name: ${locationModelInstanc.cityName}`);
    htmlRef.children('#location-details').children('.card').children('.card-body').children('#country-name').text(`Country: ${locationModelInstanc.country}`);
    htmlRef.children('#location-details').children('.card').children('.card-body').children('#airport').text(`Airport: ${locationModelInstanc.airport}`);
    htmlRef.children('#location-details').children('.card').children('.card-body').children('#flight-type').text(`International: ${locationModelInstanc.international}`);

    htmlRef.children('#location-details').children('.card').children('.card-body').children('.btn-outline-danger-delete').on('click',async()=>{

        

    });
    
    
    return htmlRef;
}
