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
  var next = moment(t);
  while (next.isBefore(moment())) {
    next = next.add(freq, "m");
  }
  return next;
}
function minutesToArrive(next) {
  var diff = next.diff(moment(), "minutes");
  return diff;
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
    .onSnapshot((querySnapshot) => {
      var $tableBody = $('#trainData');
      $tableBody.children().remove();
      querySnapshot.forEach((item) => {
        var key = item.id;
        var trainName = item.data().trainName;
        var destination = item.data().destination;
        //Adding the method toDate to the data retrieved 
        // from firebase converts it to a JS Date object.
        var firstTime = moment(item.data().firstTime.toDate());
        var frequency = item.data().frequency;
        var nextArrival = calculateArival(firstTime, frequency);
        var minutesAway = minutesToArrive(nextArrival);

        var $row = $('<tr class"table-row">');
        $row.attr('id', key);
        $row.append('<td>' + trainName + '</td>');
        $row.append('<td>' + destination + '</td>');
        $row.append('<td>' + frequency + ' min</td>');
        $row.append('<td>' + nextArrival.format("hh:mm a") + '</td>');
        $row.append('<td>' + minutesAway + ' min</td>');

        var $editButton = $('<a href="#" class="text-success editBtn">').html('<i class="far fa-edit"/>');
        $editButton.data("trainId", key);
        $editBtnCell = $('<td class="btn-cell">').append($editButton);
        $row.append($editBtnCell);

        var $delButton = $('<a href="#" class="text-danger deleteBtn">').html('<i class="fas fa-trash-alt"/>');
        $delButton.data("trainId", key);
        $delBtnCell = $('<td class="btn-cell">').append($delButton);
        $row.append($delBtnCell);

        $tableBody.append($row);
      });
    });

  $('#trainData').on("click", ".deleteBtn", function (event) {
    event.preventDefault();
    var id = $(this).data("trainId");
    db.collection("trains").doc(id).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  });
});
