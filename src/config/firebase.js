import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCmeP6Kcwh24DO9o99GF8XqtJukx4TgikA",
    authDomain: "movie-6a34e.firebaseapp.com",
    databaseURL: "https://movie-6a34e.firebaseio.com",
    projectId: "movie-6a34e",
    storageBucket: "movie-6a34e.appspot.com",
    messagingSenderId: "776581630045"
    };
firebase.initializeApp(config);

export default firebase;