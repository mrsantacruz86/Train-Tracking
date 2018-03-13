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


function createNewEmployee(name, role, startDate, monthlyRate) {
  var employee = {
    name: name,
    role: role,
    startDate: startDate,
    monthlyRate: monthlyRate,
  };
    
  database.ref('train').push(employee);
}

$("#submitBtn").click(function (event) {
  event.preventDefault();
  var empName = $('#trainName').val();
  var startD = $('#destination').val();
  var role = $('#role').val();
  var rate = $('#monthlyRate').val();
  createNewEmployee(empName, role, startD, rate);
  $('#dataEntry input').val("");
})

$(document).ready(function () {
  
  database.ref('people').on("child_added", function (childSnapshot) {
    var key = childSnapshot.key;
    var name = childSnapshot.val().name;
    var role = childSnapshot.val().role;
    var start = new Date(childSnapshot.val().startDate);
    var rate = childSnapshot.val().monthlyRate
    
    console.log(key);
    console.log(name);
    console.log(role);
    console.log(start);
    console.log(rate);
    
    var curDate = new Date();
    var msToMonthFactor = 3.85802e-10;
    var monthsWorked = parseInt((curDate - start) * msToMonthFactor);
    var empBilled = (monthsWorked * rate).toFixed(2);
    var dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  
    $('#employeeData').append("<tr data='" + key + "'><td>" + name + "</td><td>" + role + "</td><td>" +
    start.toLocaleDateString('en-US', dateOptions) + "</td><td>" + monthsWorked + "</td><td>" + rate + "</td><td>$ " + empBilled + "</td></tr>");
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});  