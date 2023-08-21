const generateFlightHTML = (flightModelInstance,i,isPopular = false) => {
    let htmlRef = !isPopular ? $("#allFlight-template").clone(): $("#flight-template").clone();
    htmlRef.attr('style',"background-color: rgb(224, 224, 217)");
    htmlRef.children('.destination-photo').attr('src',flightModelInstance.imageUrl);
    htmlRef.attr('id',`${flightModelInstance._id["$oid"]}`);
    let flightHeader = htmlRef.children('.flight-header');
    flightHeader.children('.price').text(`PRICE: ${flightModelInstance.price}$`)
    flightHeader.children('.flight-title').text(`FLIGHT NUMBER:  ${flightModelInstance.title}`)
    let content = htmlRef.children('.content');
    content.children('.origin').text(`From: ${flightModelInstance.origin}`)
    content.children('.destination').text(`To: ${flightModelInstance.destination}`)
    content.children('.departure').text(`Departing: ${flightModelInstance.departTime}`)
    content.children('.arrival').text(`ETA: ${flightModelInstance.estimatedTimeOfArrival}`)
    
    const flight_id = flightModelInstance._id;
    if(!isPopular){
            //DELETE FLIGHT
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
    }
    

    //BUY FLIGHT
    htmlRef.children('.card-body').children('.buy-button').on('click' , async()=>{
        fetch(`${url}/flights/purchase`, {
            method: 'POST',
            headers,
            body: JSON.stringify({flight_id:flightModelInstance._id , seatType:"economy"})
        })
        .then(res => res.json())
        .then(res =>{
            if(res.msg){
                console.log(res.msg);
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