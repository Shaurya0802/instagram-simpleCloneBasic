import firebase from 'firebase'

const firebasec=firebase.initializeApp({

        apiKey: "AIzaSyBBHiAmoxcqolhDCHK4Uz_EE87QqN1XB78",
        authDomain: "instagramclone-e8844.firebaseapp.com",
        databaseURL: "https://instagramclone-e8844.firebaseio.com",
        projectId: "instagramclone-e8844",
        storageBucket: "instagramclone-e8844.appspot.com",
        messagingSenderId: "406414000811",
        appId: "1:406414000811:web:39d9b74afd122bb9b5adee",
        measurementId: "G-Z67KVJ0R8X"
    
});
const db=firebase.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export {db,auth,storage}

