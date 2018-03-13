// Initialize Firebase
var config = {
  apiKey: "AIzaSyBEaIVn-nWE_zAdUO5kc6ME9AOrBgpDuQE",
  authDomain: "train-activity-11009.firebaseapp.com",
  databaseURL: "https://train-activity-11009.firebaseio.com",
  projectId: "train-activity-11009",
  storageBucket: "train-activity-11009.appspot.com",
  messagingSenderId: "819681364246"
};
firebase.initializeApp(config);

var database = firebase.database();
var msToMinuteFactor = 1/(60000);

function addTrain(trainName, destination, firstTime, frequency) {
  var train = {
    trainName: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency,
  };
    
  database.ref('trains').push(train);
}

$(document).ready(function () {
  $("#submitBtn").click(function (event) {
    event.preventDefault();
    var trainName = $('#trainName').val();
    var destination = $('#destination').val();
    var firstTime = $('#firstTime').val();
    var frequency = $('#frequency').val();
    addTrain(trainName, destination, firstTime, frequency);
    $('#dataEntry input').val("");
  })
  
  database.ref('trains').on("child_added", function (childSnapshot) {
    var key = childSnapshot.key;
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;

    var curDate = new Date();

    var firstTime = new Date(childSnapshot.val().firstTime);
    var frequency = childSnapshot.val().frequency
    
    console.log(key);
    console.log(trainName);
    console.log(destination);
    console.log(firstTime);
    console.log(frequency);
    
    
    var minutesAway = 1000;
    // var empBilled = (monthsWorked * rate).toFixed(2);
    var timeOptions = {hour:"2-digit", minute:"2-digit"};
    var nextArrival = firstTime.toLocaleTimeString('en-US', timeOptions);
    
    $('#trainData').append("<tr data='" + key + "'><td>" + trainName + "</td><td>" + destination + "</td><td>" +
    frequency + " min</td><td>" + nextArrival + "</td><td>" + minutesAway + " min</td></tr>");
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});  