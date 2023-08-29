const generateLoctionHTML = (locationModelInstanc) =>{
    let htmlRef = $("#location-template").clone();
    
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-title-country-name').text(`${locationModelInstanc.country}`);
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-city-city-name').text(`${locationModelInstanc.cityName}`);
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-text-airport').text(`Airport -  ${locationModelInstanc.airport}`);
    htmlRef.children('.flex-grow-1').children('.card-body-location-tamplate').children('.card-text-international').text(`International -  ${locationModelInstanc.international}`);
    //htmlRef.children('.card-head').children('.card-img-location').attr('src',locationModelInstanc.imageUrl);
    

    //TODO - DELETE LOCATION
    htmlRef.children('.card-head-location-tamplate').children('.btn-outline-danger-location').on('click',async()=>{
        


        loadMainComponent('addLocation');
    });

    //TODO - EDIT LOCATION
    htmlRef.children('.circle-edit-location').on('click',()=>{
        $('#spaceForEditLocation').load(`${views_path}/editLocationTemplate.html`, async () => {
        let origin = $("#origin-loc").val();
        let destination = $("#destination-loc").val();
        let airPort = $("#airport-loc").val();
        let international = $("#internationalSwitch-loc").prop('checked');
        console.log(origin);
        console.log(destination);
        console.log(airPort);
        console.log(international);

        const new_location = {origin,destination,airPort,international};

        htmlRef.children('.save-changes-location-edit').on('submit',()=>{
            
            //validaition for empty fields
            if(origin == '' || destination == '' || airPort == ''){
                alert('please fill all the fields');
                return;
            }
            fetch(`${url}/locations/update`,{
                method:'POST',
                headers,
                body:JSON.stringify(locationModelInstanc.cityName , new_location)
            })
            .then(res=>res.json())
            .then(res=>{
                if(res == true){
                    console.log('location updated');
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
