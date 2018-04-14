import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyDTMVJ8UBYaQ2qGQn56P2BlDfLnlaroWKw",
    authDomain: "pa195-todolist.firebaseapp.com",
    databaseURL: "https://pa195-todolist.firebaseio.com",
    projectId: "pa195-todolist",
    storageBucket: "",
    messagingSenderId: "959713156572"
};
firebase.initializeApp(config);
export default firebase;