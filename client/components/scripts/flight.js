const generateFlightHTML = (flightModelInstance,i,isPopular = false) => {
    let htmlRef = !isPopular ? $("#allFlight-template").clone(): $("#flight-template").clone();
    htmlRef.attr('style',"background-color: rgb(224, 224, 217)");
    htmlRef.children('.destination-photo').attr('src',flightModelInstance.imageUrl);
    htmlRef.attr('id',`${flightModelInstance._id["$oid"]}`);
    let flightHeader = htmlRef.children('.flight-header');
    flightHeader.children('.price').text(`PRICE: ${flightModelInstance.price}`)
    flightHeader.children('.flight-title').text(`FLIGHT NUMBER:  ${flightModelInstance.title}`)
    let content = htmlRef.children('.content');
    content.children('.origin').text(`From: ${flightModelInstance.origin}`)
    content.children('.destination').text(`To: ${flightModelInstance.destination}`)

    

    let inputString = flightModelInstance.departTime;
    let outputString = inputString.replace("T00:00:00.000Z", "");
    outputString = formatDate(outputString);
    content.children('.departure').text(`Departing: ${outputString}`)
    
    inputString = flightModelInstance.estimatedTimeOfArrival;
    outputString = inputString.replace("T00:00:00.000Z", "");
    outputString = formatDate(outputString);
    content.children('.arrival').text(`ETA: ${outputString}`)
        
    const flight_id = flightModelInstance._id;

    //functions for admins
    if(!isPopular){

        //DELETE FLIGHT From all flights
        htmlRef.children('.card-body').children('.delete-flight-btn').on('click',async()=>{
            fetch(`${url}/flights/deleteFromAllUsers`, {
                method: 'POST',
                headers,
                body: JSON.stringify({flight_id:flight_id})
            })
            .then(res => res.json())
            .then(res =>{
                if(res.error){
                    console.log(res.error);
                    return;
                }
            })
            .catch(err => {
                console.log(err); 
            })

            fetch(`${url}/flights/delete`, {
                method: 'POST',
                headers,
                body: JSON.stringify({id:flight_id})
            })
            .catch(err => {
                console.log(err); 
            })

            loadMainComponent('allFlights');
        });

        //BUY FLIGHT
        htmlRef.children('.card-body').children('.buy-button').on('click' , async()=>{
            console.log('baa')
            fetch(`${url}/users/addFlightsToCart`, {
                method: 'POST',
                headers,
                body: JSON.stringify({desired_flight_id:flightModelInstance._id})
            })
            .then(res => res.json())
            .then(res =>{
                if(res.msg){
                    console.log(res);
                    loadMainComponent('allFlights');
                    return;
                }
            })
            .catch(err => {
                console.log(err);
            })
    });

    //EDIT FLIGHT
    // htmlRef.children('.card-body').children('.edit-button').on('click',function(){
        
    //     loadMainComponent('addFlight');
    //     fetch(`${url}/users/update`, {
    //         method: 'POST',
    //         headers,
    //         body: JSON.stringify({id:flightModelInstance._id , newData:})
    //     }
    //     ).catch(err => {
    //         console.log(err);
    //     })
    //     loadMainComponent('allFlights');
    // });
    }

    //functions for all users
    else{
        //BUY FLIGHT From Hot Deals
        htmlRef.children('.card-body').children('.buy-button').on('click' , async()=>{
            fetch(`${url}/flights/purchase`, {
                method: 'POST',
                headers,
                body: JSON.stringify({email:state.user,flight_id:flightModelInstance._id , seatType:"economy"})
            })
            .then(res => res.json())
            .then(res =>{
                if(res.msg){
                    // loadMainComponent('popularDeals');
                    return;
                }
            })
            .catch(err => {
                console.log(err);
            })
        });
    }
    

    

    

       //ADD TO WISHLIST
    // htmlRef.children('.card-body').children('.wishlist-button').on('click',function(){
    //     fetch(`${url}/flights/delete`, {
    //         method: 'POST',
    //         headers,
    //         body: JSON.stringify({id:flightModelInstance._id})
    //     }
    //     ).catch(err => {
    //         console.log(err); 
    //     })
    //     loadMainComponent('allFlights');
    // });

    return htmlRef;
}


function formatDate(inputDate) {
    let parts = inputDate.split('-');
    if (parts.length !== 3) {
      return "Invalid date format";
    }
  
    let year = parts[0];
    let month = parts[1];
    let day = parts[2];
  
    return `${day}/${month}/${year}`;
  }