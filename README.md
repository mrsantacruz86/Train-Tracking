
# Train Tracking System

## Project title

Train Tracking System

## Autor

Nelson Diaz.

## Project Description

This application allows the user to enter information abouth the Trains (Name, first departure time, frequenc, etc.) then the computer will calculte the time for the next arrival and the amount of time remaining. 
All the data will be displayed on a table on top showing the list of the trains that have been already entered.
The information is persistent and uses Firebase as back-end service and database.
Ass soon as a new train is added to the database the information in the table is updated to include the most recent changes.

## Languages

* HTML
* CSS
* Javascript

## Framework

* Bootstrap 3.7

## Technologies used

* JQuery.

## Database

* Firebase

### Database Code Snippet

```
<script src="https://www.gstatic.com/firebasejs/4.11.0/firebase.js"></script>

<script>
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
</script>
```
