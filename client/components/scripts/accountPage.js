async function loadUserData(email_in) {
    try {
        let email = state.user;
        let res = await fetch(`${url}/users/getUserData`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email })
        });
        res = await res.json();
        if (res.error) { return }
        $("#searchUser-input").val("");
        $('#main-component-container').load(`${views_path}/userpage.html`, async () => {
            $('.username-account').text(res.user.full_name);
            $('#useraccount-email').text(res.user.email);
            if (res.user.phone_number != null) {
                const digitCount = String(res.user.phone_number).length;
                if (digitCount > 10 && digitCount <= 12) {
                    $('#useraccount-phonenumber').text("+" + res.user.phone_number);
                }
                else {
                    $('#useraccount-phonenumber').text("0" + res.user.phone_number);
                }
            }
            else {
                $('#useraccount-phonenumber').text("No Number");
            }
            $('#totalMiles-account').text(res.user.total_miles);
            $('#futureDealsSum').text(res.future_flights.length);
            $('#pastFlights').text(res.past_flights.length);
            $('#cartSum').text(res.cart.length);


            const futureFlights = res.future_flights;
            for (let i = 0; i < futureFlights.length && i < 3; i++) {
                const flight = generateMoreInfoFlightHTML(futureFlights[i]);
                $('.future-flight-list').append(flight);
            }
            const pastFlights = res.past_flights;
            for (let i = 0; i < pastFlights.length && i < 3; i++) {
                const flight = generateMoreInfoFlightHTML(pastFlights[i]);
                $('.past-flight-list').append(flight);
            }
            //TODO -- TOFIX this !! 
            $(".circle-edit").on('click', async () => {
                $('#main-component-container').load(`${views_path}/reconfirmPassword.html`, async () => {

                    //continu button after putting password
                    $('#continue-btn-for-edit-user').on('click', async () => {
                        let tempPass = $('#passwordInput-foredit').val();
                        //check validation
                        if (tempPass == '') {
                            alert("Enter a valid Password");
                            return;
                        }

                        let checkpasswordRes = await fetch(`${url}/users/checkpassword`, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify({ email, password: tempPass })
                        })
                        checkpasswordRes = await checkpasswordRes.json();
                        console.log(checkpasswordRes);
                        if (checkpasswordRes.msg) {
                            $('#main-component-container').load(`${views_path}/editUserInfoComp.html`, () => {
                                $("#commit-user-edit").on('click', async e => {
                                    const name = $('#fullName-editinfo').val();
                                    const phone = $('#phoneNumber-editinfo').val();
                                    let passwordInput = $('#password-editinfo').val();
                                    let confirmPassword = $('#confirmPassword-editinfo').val();

                                    if (passwordInput != confirmPassword) {
                                        console.log("Passwords do not match");
                                    }
                                    else{
                                        console.log(passwordInput)
                                    }
                                    const newData = { full_name: name, phone_number: phone,password:passwordInput };
                                    console.log(newData);
                                    try{
                                        let updateResult = await fetch(`${url}/users/update`, {
                                            method: 'POST',
                                            headers,
                                            body: JSON.stringify({ email, newData })
                                        });
                                        updateResult = await updateResult.json();
                                        if (updateResult.error) {
                                            console.error(updateResult.error);
                                            return;
                                        }
                                        console.log("User info updated");
                                        loadMainComponent('userpage');
                                    }
                                    catch(err){ console.error(err);}
                                })
                            });
                        }
                    })

                });
            });


            //here it will load the data for future past and cart
            if (futureFlights.length != 0) {
                $("#allfutureflights-button").attr('style', 'background-color: #5f9ea0');
                $("#allfutureflights-button").on('click', () => {
                    $('#main-component-container').load(`${views_path}/allFlightsTamp.html`, () => {

                        for (let i = 0; i < futureFlights.length; i++) {
                            const flight = generateMoreInfoFlightHTML(futureFlights[i]);
                            $('#all-flights-info').append(flight);
                        }
                        $('#putNameHere').text('Future Flights');
                        $('#go-back-btn-allflights').on('click', () => {
                            loadMainComponent('userpage');
                        })
                    })
                })
            }

            if (pastFlights.length != 0) {
                $("#allpastflights-button").attr('style', 'background-color: blue');
                $("#allpastflights-button").on('click', () => {
                    $('#main-component-container').load(`${views_path}/allFlightsTamp.html`, () => {
                        for (let i = 0; i < pastFlights.length; i++) {
                            const flight = generateMoreInfoFlightHTML(pastFlights[i]);
                            $('#all-flights-info').append(flight);
                        }
                        $('#putNameHere').text('Past Flights');
                        $('#go-back-btn-allflights').on('click', () => {
                            loadMainComponent('userpage');
                        })
                    })
                })
            }

            if (res.cart.length != 0) {
                $("#cart-button-acc").attr('style', 'background-color: blue');
                $("#cart-button-acc").on('click', () => {
                    loadMainComponent('cart');
                })
            }


            // After populating other elements
            // Calculate average spending per month from your flight data
            const monthlyAverageData = calculateMonthlyAverage(res.future_flights);
            // Set up SVG dimensions
            const svgWidth = 600;
            const svgHeight = 400;
            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            // Create SVG container
            const svg = d3.select("#average-spending-graph")
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Create scales
            const xScale = d3.scaleBand()
                .domain(monthlyAverageData.map(d => d.month))
                .range([0, width])
                .padding(0.1);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(monthlyAverageData, d => d.spending)]) // Use d.spending instead of d.average
                .range([height, 0]);

            // Create bars
            svg.selectAll(".bar")
                .data(monthlyAverageData)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", d => xScale(d.month))
                .attr("y", d => yScale(d.spending)) // Use d.spending instead of d.average
                .attr("width", xScale.bandwidth())
                .attr("height", d => height - yScale(d.spending)) // Use d.spending instead of d.average
                .attr("fill", "steelblue");

            // Add x-axis
            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(xScale));

            // Add y-axis
            svg.append("g")
                .call(d3.axisLeft(yScale))
        })
    }
    catch (err) {
        console.error('error in accountPage.js: ', err);
    }
}
function calculateMonthlyAverage(selectedFlightArray) {
    const months = [
        { month: 'January', spending: 0 },
        { month: 'February', spending: 0 },
        { month: 'March', spending: 0 },
        { month: 'April', spending: 0 },
        { month: 'May', spending: 0 },
        { month: 'June', spending: 0 },
        { month: 'July', spending: 0 },
        { month: 'August', spending: 0 },
        { month: 'September', spending: 0 },
        { month: 'October', spending: 0 },
        { month: 'November', spending: 0 },
        { month: 'December', spending: 0 }
    ];

    const map1 = new Map();
    const monthAmount = new Map();
    months.forEach((obj, i) => {
        map1.set(obj.month, i);
        monthAmount.set(obj.month, 0);
    });
    selectedFlightArray.forEach(flight => {
        const month = new Date(flight.departTime).toLocaleString("default", { month: "long" });;
        months[map1.get(month)].spending += parseInt(flight.price);
        let prevAm = monthAmount.get(month);
        monthAmount.set(prevAm + 1);
    });
    months.forEach(monthObj => {
        if (monthAmount.get(monthObj.month)) {
            months[map1.get(monthObj.month)].spending /= monthAmount.get(monthObj.month);
        }
    });
    return months;
}