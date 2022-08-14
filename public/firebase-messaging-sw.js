importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBzBlzuGO2RRNUWg2Jk4EcxDrEusEJavKE",
    authDomain: "task-manager-6071f.firebaseapp.com",
    projectId: "task-manager-6071f",
    storageBucket: "task-manager-6071f.appspot.com",
    messagingSenderId: "521464478807",
    appId: "1:521464478807:web:7708cb69781076aa8d3712",
    measurementId: "G-26JKTD4P3Q"
  };

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();