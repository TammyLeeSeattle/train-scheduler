// ON PAGE LOAD
// --------------------------------------------------------------------

    // jQuery to make sure that things don't happen to the DOM until everything has loaded
    $( document ).ready(function() {
        console.log( "ready!" );
    });


// GLOBAL VARIABLES
// --------------------------------------------------------------------

    // config file to initialize Firebase
    var config = {
        apiKey: "AIzaSyDkxBO2AuKPClmrTQZg10MR24N4RlOUEbk",
        authDomain: "time-scheduler-a5871.firebaseapp.com",
        databaseURL: "https://time-scheduler-a5871.firebaseio.com",
        projectId: "time-scheduler-a5871",
        storageBucket: "time-scheduler-a5871.appspot.com",
        messagingSenderId: "756137547237"
    };

    firebase.initializeApp(config);

    // reference to the firebase db
    var trainData = firebase.database();



// FUNCTIONS & OPERATIONS
// --------------------------------------------------------------------

    // send data to firebase on click of submit by collecting inputs from each field and storing it
    $("#addTrainBtn").on("click", function () {
        var trainName = $("#trainNameInput").val().trim(); // take value from Train Name field, remove excess spaces, store value
        var destination = $("#destinationInput").val().trim(); // take value from Destination field, remove excess spaces, store value
        var firstTrain = moment($("#firstTrainInput").val().trim(),"HH:mm").subtract(10, "years").format("X"); // take value from First Train field, remove excess spaces, store value. Use momentJS to convert input into 'unix' variable
        var frequency = $("#frequencyInput").val().trim(); // take value from Frequency field, remove excess spaces, store value

            // // testing
            // console.log(firstTrain);
            // return false; // otherwise page will reload because 'submit' type on button

        // on click, create a new train item in storage
        var newTrain = {
            name: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        }

        // add user input to the storage
        trainData.ref().push(newTrain);

        // show success that a submit has occured
        alert("Train Added!");

        // update html with new user input
        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#firstTrainInput").val("");
        $("#frequencyInput").val("");

        // prevents reload of page based on submit button
        return false;
    })

    // collect data from firebase
    trainData.ref().on("child_added", function (snapshot) {
        var name = snapshot.val().name;
        var destination = snapshot.val().destination;
        var frequency = snapshot.val().frequency;
        var firstTrain = snapshot.val().firstTrain;


    // figure out when next train is and when it'll arrive using momentJS
    var remainder = moment().diff(moment.unix(firstTrain), "minutes")%frequency;
    var minutes = frequency - remainder;
    var arrival = moment().add(minutes, "m").format("hh:mm A");

        // testing
        console.log(remainder);
        console.log(minutes);
        console.log(arrival);

    // update HTML to show data retrieved/calculated from firebase
    $("#trainTable > tBody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");

    })

    






// OTHER OPERATIONS
// --------------------------------------------------------------------