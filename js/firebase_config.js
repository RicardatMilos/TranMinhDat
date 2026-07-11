const firebaseConfig = {
    apiKey: "AIzaSyDcHZ30uya-iMSA88EyZduH6wpExgVezkk",
    authDomain: "finalproject-33441.firebaseapp.com",
    projectId: "finalproject-33441",
    storageBucket: "finalproject-33441.firebasestorage.app",
    messagingSenderId: "165583353107",
    appId: "1:165583353107:web:127519051ea0a269d616e6",
    measurementId: "G-JDGWEGTF1B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize User Authenitcation
const auth = firebase.auth();

// Initialize Database
const db = firebase.firestore();

// Initialize Smaller Database (teacher said so)
const storage = firebase.storage();

console.log(firebase.app().name);