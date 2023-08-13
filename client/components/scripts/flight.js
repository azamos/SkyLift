const generateFlightHTML = (flightModelInstance,i,isPopular = false) => {
    let htmlRef = !isPopular ? $("#allFlight-template").clone(): $("#flight-template").clone();
    htmlRef.attr('style',"background-color: rgb(224, 224, 217)");
    htmlRef.children('.destination-photo').attr('src',`./images/destination/${camelize(flightModelInstance.destination)}.jpg`)
    htmlRef.attr('id',`${flightModelInstance._id["$oid"]}`);
    let flightHeader = htmlRef.children('.flight-header');
    flightHeader.children('.price').text(`PRICE: ${flightModelInstance.price}$`)
    flightHeader.children('.flight-title').text(`FLIGHT NUMBER:  ${flightModelInstance.title}`)
    let content = htmlRef.children('.content');
    content.children('.origin').text(`From: ${flightModelInstance.origin}`)
    content.children('.destination').text(`To: ${flightModelInstance.destination}`)
    content.children('.departure').text(`Departing: ${flightModelInstance.departTime}`)
    content.children('.arrival').text(`ETA: ${flightModelInstance.estimatedTimeOfArrival}`)
    
    //TODO
    $('.delete-flight-btn').on('click', function() {
        //const flight_id = $(this).parent().parent().attr('id');
        fetch(`${url}/flights/:${flightModelInstance._id["$oid"]}`, {
            method: 'DELETE',
            headers: state.token
        }
        ).catch(err => {
            console.log(err);
        })
    });

    //content.children('.connection').text(`${flightModelInstance.<replaceWithModelPropertyName>}`)
    return htmlRef;
}