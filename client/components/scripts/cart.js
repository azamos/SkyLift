//here load cart items
const loadCart = async () => {
    fetch(`${url}/users/getUserData`,{
        method:'POST',
        headers,
        body:JSON.stringify({email:state.user})
    })
    .then(res=>res.json())
    .then(res=>{
        if(res.error){
            return;
        }
        $('#add-here-cart-items').load(`${views_path}/cartComponent.html`,x=>{
            res.cart.forEach(flightCartModelInstanc => {
                let htmlRef = generateCartHTML(flightCartModelInstanc);
                $('#add-here-cart-items').append(htmlRef);
            });
        });
    })
    .catch(err=>console.log(err));
}

const generateCartHTML =  flightModelInstanc => {
    let htmlRef = $("#cart-flight-item-container").clone();
    let headCartTemp = htmlRef.find('.head-cart-temp');
    
    headCartTemp.find('.fromwhere-to-where').text(`${flightModelInstanc.origin} TO ${flightModelInstanc.destination}`);
    
    let inputString = flightModelInstance.departTime;
    let outputString = inputString.replace("T00:00:00.000Z", "");
    outputString = formatDate(outputString);

    headCartTemp.find('.date-leaving').text(`Leaving: ${outputString}`);

    inputString = flightModelInstance.estimatedTimeOfArrival;
    outputString = inputString.replace("T00:00:00.000Z", "");
    outputString = formatDate(outputString);

    headCartTemp.find('.date-arriving').text(`ETA: ${outputString}`);
    headCartTemp.find('.airline-company').text(`Airline: ${flightModelInstanc.company}`);
    headCartTemp.find('.flight-price').text(`Price: ${flightModelInstanc.price}$`);
    
    return htmlRef;
}



//here load checkout items

const loadCheckout = async () => {
    fetch(`${url}/users/getUserData`,{
        method:'POST',
        headers,
        body:JSON.stringify({email:state.user})
    })
    .then(res=>res.json())
    .then(res=>{
        if(res.error){
            return;
        }
        $('#here-add-checkout-items-component').load(`${views_path}/checkoutComponent.html`,x=>{
            res.cart.forEach(flightCheckoutModelInstanc => {
                let htmlRef  = checkoutFlightGeneratorHtml(flightCheckoutModelInstanc);
                $('#here-add-checkout-items-component').append(htmlRef);
        
                });
        });
    })
    .catch(err=>console.log(err));
}

const checkoutFlightGeneratorHtml = flightModelInstanc => {
    let htmlRef = $("#checkout-component-items").clone();
    htmlRef.children('.div-1-in').children('.div-2-in').children('.fromwhere-to-where').text(`${flightModelInstanc.origin} TO ${flightModelInstanc.destination}`);
    
    let inputString = flightModelInstanc.departTime;
    let outputString = inputString.replace("T00:00:00.000Z", "");
    outputString = formatDate(outputString);
    htmlRef.children('.div-1-in').children('.div-2-in').children('.date-leaving').text(`Leaving: ${outputString}`);

    inputString = flightModelInstanc.estimatedTimeOfArrival;
    outputString = inputString.replace("T00:00:00.000Z", "");
    outputString = formatDate(outputString);

    htmlRef.children('.div-1-in').children('.div-2-in').children('.date-arriving').text(`ETA: ${outputString}`);
    htmlRef.children('.div-1-in').children('.div-2-in').children('.airline-company').text(`Airline: ${flightModelInstanc.company}`);
    htmlRef.children('.div-1-in').children('.div-2-in').children('.flight-price').text(`Price: ${flightModelInstanc.price}$`);

    return htmlRef;
}