const searchFlight = e => {
    e.preventDefault();//DO NOT REMOVE, OTHERWISE WILL REFRESH
}

let autocomplete_timer = null;//To avoid sending a request to the server every milisecond

//Will be the on input event handler for the cityName field in the addLocationForm.html
const auto_complete= e => {
    if(autocomplete_timer){
        clearTimeout(autocomplete_timer);//Cancel previous kek stroke autocomplete http request
    }
    if(e.target.value.trim()==""){
        console.log("empty search");
        if(e.target.id=="destinationInput"){
            $("#destination-dropdown").html("");
        }
        if(e.target.id=="originInput"){
            $("#origin-dropdown").html("");
        }
        return;
    }
    if(e.target.value.trim().length<3){
        console.log("Not Enough Letters");
        //HIDING THE EMPTY DROPDOWN
        if(e.target.id=="destinationInput"){
            $("#destination-dropdown").hide();
        }
        if(e.target.id=="originInput"){
            $("#origin-dropdown").hide();
        }
        return;
    }
    autocomplete_timer = setTimeout(()=>fetch_autocomplete_suggestions(e.target.value,e.target.id),1000);
}
const set_destinationInput = str => $("#destinationInput").val(str);
const set_originInput = str => $("#originInput").val(str);

function fetch_autocomplete_suggestions(partial_string,id){
    fetch(`${url}/locations/${partial_string}`)
    .then(res=>res.json())
    .then(res=>{
        if(id=="destinationInput"){
            //First, remove previous autocomplete results
            $("#destination-dropdown").html("");
            res.forEach(x=>
            $("#destination-dropdown")
            .append($(`<li><a class="dropdown-item">${x.cityName}</a></li>`)
            .on('click',()=>set_destinationInput(x.cityName))));
            $("#destination-dropdown").show();
        }
        if(id=="originInput"){
            //First, remove previous autocomplete results
            $("#origin-dropdown").html("");
            res.forEach(x=>
                $("#origin-dropdown")
                .append($(`<li><a class="dropdown-item">${x.cityName}</a></li>`)
                .on('click',()=>set_originInput(x.cityName))));
                $("#origin-dropdown").show();
        }
    })
    .catch(err=>console.log(err))
}