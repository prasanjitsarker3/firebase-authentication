import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

// firebase.initializeApp(firebaseConfig);
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}
else{
  firebase.app();
}

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn= () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName,photoURL,email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photoURL: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name:'',
        photo:'',
        email:''
      }
      setUser(signedOutUser);
      console.log(res);
    })
    .catch(err =>{
      
    })
  }
  return (
    <div className="App">
      <h1> Firebase Authentication</h1>
      {
        user.isSignedIn ?<button onClick={handleSignOut} className="button">Sign Out</button>:
        <button onClick={handleSignIn} className="button">Sign in</button>
      }
      
      {
        user.isSignedIn && <div>
         <p>Welcome, {user.name}</p>
         <img src={user.photoURL} alt="" srcset="" width="10%" />
         
         </div>
      }
    </div>
  );
}

export default App;
