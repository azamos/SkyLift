const addLocation = async e => {
    e.preventDefault();
    const cityName_input = $("#cityName-input");
    const country_input = $("#country-input");
    fetch(`${url}/locations`,{
        method:'POST',
        headers:{
            'Content-Type':'Application/json',
        },
        body:JSON.stringify({'cityName':cityName_input.val(),'country':country_input.val()})
    }).then(res=>res.json()).then(res=>console.log(res))
}