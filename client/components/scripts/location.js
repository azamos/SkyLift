const generateLoctionHTML = (locationModelInstanc) =>{
    let htmlRef = $("#location-template").clone();
    
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-title-country-name').text(`${locationModelInstanc.country}`);
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-city-city-name').text(`${locationModelInstanc.cityName}`);
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-text-airport').text(`Airport -  ${locationModelInstanc.airport}`);
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-text-international').text(`International -  ${locationModelInstanc.international}`);
    

    //TODO - DELETE LOCATION
    htmlRef.children('.card-head-location-tamplate').children('.btn-outline-danger-location').on('click',()=>{
        


        loadMainComponent('addLocation');
    });

    //TODO - EDIT LOCATION
    htmlRef.children('.circle-edit-location').on('click',()=>{
        $('#spaceForEditLocation').load(`${views_path}/editLocationTemplate.html`, async () => {

        $('#save-changes-location-edit').on('click',e =>{
            let airport = $("#airport-loc").val();
            let cityName = $("#city-loc").val();
            let country = $("#country-loc").val();
            let international = $("#internationalSwitch-loc").prop('checked');

            const new_location = {airport,cityName,country,international};

            //validaition for empty fields
            if(airport == '' || cityName == '' || country == ''){
                alert('please fill all the fields');
                return;
            }

            fetch(`${url}/locations/update`,{
                method:'POST',
                headers,
                body:JSON.stringify({airport:locationModelInstanc.airport,
                                     cityName:locationModelInstanc.cityName,
                                     country:locationModelInstanc.country,
                                     data:new_location})
            })
            .then(res=>res.json())
            .then(res=>{
                if(res == true){
                    loadMainComponent('addLocation');
                }
                else{
                    console.log('location not updated');
                }
            })
            .catch(e=>console.error(e))
        });
        
        });
    });
    
    return htmlRef;
}