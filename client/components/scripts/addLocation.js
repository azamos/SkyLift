const addLocation = async e => {
    e.preventDefault();
    const cityName_input = $("#cityName-input");
    const country_input = $("#country-input");
    const airport_input = $("#airport-input");
    fetch(`${url}/locations`,{
        method:'POST',
        headers,
        body:JSON.stringify({'cityName':cityName_input.val(),'country':country_input.val(),'airport':airport_input.val()})
    }).then(res=>res.json()).then(res=>console.log(res)).catch(e=>console.error(e))
    loadMainComponent('addLocation');
}


const loadLocations = async () => {
    fetch(`${url}/locations`,{
        method:'GET',
        headers
    })
    .then(res=>res.json())
    .then(res=>{
        if(res.error){
            return;
        }
        res.forEach(locationModelInstanc => {
            let htmlRef  = generateLoctionHTML(locationModelInstanc);
            $('#locations-container').append(htmlRef);
        });
    })
    .catch(err=>console.log(err));
}