const addLocation = async e => {
    e.preventDefault();
    let cityName_input = $("#cityName-input").val();
    let country_input = $("#country-input").val();
    let airport_input = $("#airport-input").val();
    
    if(cityName_input == "" || country_input == "" ||  airport_input==""){
        alert("Please Fill All Fileds");
        return;
    }

    let check = checkInput(cityName_input);
    if(!check){
        alert("City Name is not valid!");
        return;
    }
    check = checkInput(country_input);
    if(!check){
        alert("country Name is not valid!");
        return;
    }
    check = checkInput(airport_input);
    if(!check){
        alert("airport Name is not valid!");
        return;
    }
    cityName_input = formatInput(cityName_input);
    country_input = formatInput(country_input);
    airport_input = formatInput(airport_input , true);
    
    fetch(`${url}/locations`,{
        method:'POST',
        headers,
        body:JSON.stringify({'cityName':cityName_input,'country':country_input,'airport':airport_input})
    })
    .then(res=>res.json())
    .catch(e=>console.error(e))
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



function formatInput(inputString , isAirport = false) {
    // Remove leading and trailing spaces
    inputString = inputString.trim();

    // Split the input string into words
    var words = inputString.split(/\s+/);

    // Format each word: capitalize first letter, make the rest lowercase
    for (var i = 0; i < words.length; i++) {
        if(words[i].toUpperCase() === "USA"){
            words[i] = words[i].toUpperCase(); 
        }
        else if (!isAirport) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
        } else {
            words[i] = words[i].toUpperCase(); // Keep 3 letters airport capital
        }
    }

    // Join the formatted words to create the formatted input
    var formattedInput = words.join(" ");

    return formattedInput;
}

function checkInput(inputString) {
    // Check if the input has at least 2 letters
    if (inputString.length < 2) {
        return false;
    }

    // Format the input
    var formattedInput = formatInput(inputString);

    // Check if the formatted input follows the validation rules
    var words = formattedInput.split(/\s+/);

    // Check if each word has at least two letters
    for (var i = 0; i < words.length; i++) {
        if (words[i].length < 2) {
            return false;
        }
    }

    return true;
}
