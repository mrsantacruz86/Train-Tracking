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

var db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

function addTrain(trainName, destination, firstTime, frequency) {
  var train = {
    trainName: trainName,
    destination: destination,
    firstTime: moment(firstTime, "hh:mm am/pm").toDate(),
    frequency: frequency,
  };

  db.collection('trains')
    .add(train)
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

function calculateArival(t, freq) {
  return moment(t).add(freq, "m").format("hh:mm A");
}
function minutesToArrive(t) {
  return moment(t).subtract(freq, "m").format("hh:mm A");
}

$(document).ready(function () {
  $("#submitBtn").click(function (event) {
    event.preventDefault();
    var trainName = $('#trainName').val();
    var destination = $('#destination').val();
    var firstTime = ($('#firstTime').val());
    var frequency = $('#frequency').val();
    addTrain(trainName, destination, firstTime, frequency);
    $('#dataEntry input').val("");
  })

  db.collection("trains")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((item) => {
        var key = item.key;
        var trainName = item.data().trainName;
        var destination = item.data().destination;
        var firstTime = moment(item.data().firstTime);
        var frequency = item.data().frequency;
        var nextArrival = calculateArival(firstTime, frequency);
        var minutesAway = 1000;

        $('#trainData').append("<tr data='" + key + "'><td>" + trainName + "</td><td>" + destination + "</td><td>" +
          frequency + " min</td><td>" + nextArrival + "</td><td>" + minutesAway + " min</td></tr>");
      });
    });
});
