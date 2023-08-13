const generateFlightHTML = (flightModelInstance, i) => {
    let htmlRef = $("#flight-template").clone();
    htmlRef.attr('style', "background-color: rgb(224, 224, 217)");
    htmlRef.children('.destination-photo').attr('src', `./images/destination/${camelize(flightModelInstance.destination)}.jpg`)
    htmlRef.attr('id', `FLIGHT #${i + 1}`);
    let flightHeader = htmlRef.children('.flight-header');
    flightHeader.children('.price').text(`PRICE: ${flightModelInstance.price}$`)
    flightHeader.children('.flight-title').text(`FLIGHT NUMBER:  ${flightModelInstance.title}`)
    let content = htmlRef.children('.content');
    content.children('.origin').text(`From: ${flightModelInstance.origin}`)
    content.children('.destination').text(`To: ${flightModelInstance.destination}`)
    content.children('.departure').text(`Departing: ${flightModelInstance.departTime}`)
    content.children('.arrival').text(`ETA: ${flightModelInstance.estimatedTimeOfArrival}`)
    //content.children('.connection').text(`${flightModelInstance.<replaceWithModelPropertyName>}`)
    $("#featuredDeals").append(htmlRef);
}