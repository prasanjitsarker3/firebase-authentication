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
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password:'',
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
        email:'',
        error:'',
        success:false
      }
      setUser(signedOutUser);
      console.log(res);
    })
    .catch(err =>{
      
    })
  }
  const handleBlur = (e) => {
      // console.log(e.target.name, e.target.value); 
      let isFieldValid = true;

      if(e.target.name === 'email'){
        isFieldValid=/\S+@\S+\.\S+/.test(e.target.value) 
         
      }
      if(e.target.name === 'password'){
         const isPasswordValid = e.target.value.length > 6;
         const passwordHasNumber = /\d{1}/.test(e.target.value)
         isFieldValid=passwordHasNumber && isPasswordValid;
         
      }
      if(isFieldValid){
        const newUserInfo= {...user}
        newUserInfo[e.target.name]=e.target.value;
        setUser(newUserInfo)
      }
  }
  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then((res) => {
    // Signed in 
    const newUserInfo= {...user}
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo);
    updateUserName(user.name);
  })
  .catch(error => {
    const newUserInfo= {...user}
    newUserInfo.error=error.message;
    newUserInfo.success=false;
   setUser(newUserInfo);
    
  });

    } 
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res => {
    const newUserInfo= {...user}
    newUserInfo.error='';
    newUserInfo.success=true;
    setUser(newUserInfo);
    console.log('Sign In User ', res.user);
  })
  .catch((error) => {
    const newUserInfo= {...user}
    newUserInfo.error=error.message;
    newUserInfo.success=false;
   setUser(newUserInfo);
  });
    }
    e.preventDefault();
  }
  
  const updateUserName = name => {
    const user = firebase.auth().currentUser;

     user.updateProfile({
     displayName: name
    
     }).then(() => {
        console.log('User name updated successfully')
     }).catch((error) => {
       console.log(error);
  
    });  
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
       <h2 >Our Own Authentication</h2>
       <input type="checkbox" onChange={() => setNewUser(!newUser)}  name="newUser" id="" />
       <label  htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit} className="form-about ">
       
        {newUser && <input type="text" name="name"  className="form" onBlur={handleBlur} placeholder="Enter your name"/>}
        <br />
        <input type="text" name="email" className="form" onBlur={handleBlur}  placeholder="Email Address" required/>
        <br />
        <input type="password" name="password" className="form" onBlur={handleBlur} placeholder="Password" required/> 
        <br />
        <input className="form-btn" type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {
        user.success && <p style={{color:'green'}}>User {newUser ? 'Created' : 'Logged in'} successfully</p>
      }
      
    
    </div>
  );
}

export default App;
