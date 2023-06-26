const searchFlight = e => {
    e.preventDefault();//DO NOT REMOVE, OTHERWISE WILL REFRESH
}

let autocomplete_timer = null;//To avoid sending a request to the server every milisecond

//Will be the on input event handler for the cityName field in the addLocationForm.html
const auto_complete_origin = e => {
    if(autocomplete_timer){
        clearTimeout(autocomplete_timer);//Cancel previous kek stroke autocomplete http request
    }
    if(e.target.value.trim()==""){
        console.log("empty search");
        return;
    }
    if(e.target.value.trim().length<3){
        console.log("Not Enough Letters");
        return;
    }
    autocomplete_timer = setTimeout(()=>fetch_autocomplete_suggestions(e.target.value),1000);
}

function fetch_autocomplete_suggestions(partial_string){
    fetch(`${url}/locations/${partial_string}`)
    .then(res=>res.json())
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
}