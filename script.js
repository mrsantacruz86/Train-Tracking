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

var trainId = "";

function updateTrain(id, trainName, destination, firstTime, frequency) {
  var train = {
    trainName: trainName,
    destination: destination,
    firstTime: moment(firstTime, "hh:mm am/pm").toDate(),
    frequency: frequency,
  };
  if (id) {
    db.collection('trains').doc(id).set(train)
      .then(function () {
        console.log("Document updated. ID: ", id);
      })
      .catch(function (error) {
        console.error("Error updating document. ", error);
      });
  } else {
    db.collection('trains').add(train)
      .then(function (docRef) {
        console.log("Document Updated. ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error updating document: ", error);
      });
  }
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
function spinner() {
  var spin = $('<div class="spin">').appendTo($('<div class="center-block">'));
  return $(spin)
}

$(document).ready(function () {
  // Form validation.
  function validateForm(submitProc) {
    const name = $('#trainName').val();
    const dest = $('#destination').val();
    const time = $('#firstTime').val();
    const freq = $('#frequency').val();
    if (name == "" || typeof name !== "string") {
      alert('Please revise train\'s name.');
    } else if (dest == "" || typeof dest !== "string") {
      alert('Please revise destination.');
    } else if (time === "" || typeof time !== "string") {
      alert('Please revise the time.');
    } else if (freq == "" || typeof freq !== "string" || freq <= 0) {
      alert('Please revise the frequency.');
    } else {
      submitProc
    }

  }
  $("#submitBtn").click(function (event) {
    event.preventDefault();
    var trainName = $('#trainName').val();
    var destination = $('#destination').val();
    var firstTime = ($('#firstTime').val());
    var frequency = $('#frequency').val();
    validateForm(updateTrain(trainId, trainName, destination, firstTime, frequency));
    $('#dataEntry input').val("");
  });

  $('#trainData').append(spinner());

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

        var $editButton = $('<a href="#" class="text-info editBtn">').html('<i class="far fa-edit"/>');
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
    trainId = id;
    db.collection("trains").doc(id).delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  });

  $('#trainData').on("click", ".editBtn", function (event) {
    event.preventDefault();
    var id = $(this).data("trainId");
    console.log(id);
    db.collection("trains").doc(id).get()
      .then(function (doc) {
        if (doc.exists) {
          trainId = doc.id;
          populateForm(doc.data());
          var $inputs = $("input");
          $inputs[0].focus();
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.error("Error loading document: ", error);
      });
  });

  // Fill the form fields when record is selected to edit.
  function populateForm(data) {
    $('#trainName').val(data.trainName);
    $('#destination').val(data.destination);
    var time = moment(data.firstTime.toDate());
    $('#firstTime').val(time.format("HH:MM"));
    $('#frequency').val(data.frequency);
  }

});



