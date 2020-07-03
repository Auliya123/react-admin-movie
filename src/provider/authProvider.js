import {  AUTH_LOGIN, AUTH_LOGOUT,
  AUTH_CHECK, AUTH_GET_PERMISSIONS
} from 'react-admin';
import firebase from '../config/firebase';


// Initialize Firebase
var db = firebase.firestore();
var storage = firebase.storage();


export const authProvider = (type, params) => {

if (type === AUTH_LOGIN) {
  const { username, password} = params;
  return firebase.auth()
              .signInWithEmailAndPassword(username, password)
              .catch( (error) => { throw new Error({ message:error.message, status: 401}) } )
}

if (type === AUTH_LOGOUT) {
  return firebase.auth().signOut()
      .catch( (error) => { throw new Error({ message:error.message, status: 500}) } );
}

if (type === AUTH_CHECK) {
  console.log(firebase.auth().currentUser);
  return firebase.auth().currentUser ? Promise.resolve() : Promise.reject();
}


if (type === AUTH_GET_PERMISSIONS) {
    // Try to find a "user" collection and return the role attribute
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
    return db.collection("users")
        .doc(user.uid)
        .get()
        .then( doc => {
            if (doc.exists) {
                return doc.data().role;
            } else {
                return 'user'
            }
        })
        .catch( error => {
            return 'user'
        });
      }
    })
}

return Promise.resolve();
}