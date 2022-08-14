import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { apiUrl } from "./config";


const firebaseConfig = {
    apiKey: "AIzaSyBzBlzuGO2RRNUWg2Jk4EcxDrEusEJavKE",
    authDomain: "task-manager-6071f.firebaseapp.com",
    projectId: "task-manager-6071f",
    storageBucket: "task-manager-6071f.appspot.com",
    messagingSenderId: "521464478807",
    appId: "1:521464478807:web:7708cb69781076aa8d3712",
    measurementId: "G-26JKTD4P3Q"
  };
export const initializeFirebase = () => {
    initializeApp(firebaseConfig);
//   firebase.initializeApp(firebaseConfig);
}


// import { getMessaging, getToken } from "firebase/messaging";

// // Get registration token. Initially this makes a network call, once retrieved
// // subsequent calls to getToken will return from cache.
// const messaging = getMessaging();
// getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });


export const askForPermissionToReceiveNotifications = async () => {
    try {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              console.log('Notification permission granted.');
            }
        })
      const messaging = getMessaging();

    //   await messaging.requestPermission();
      getToken(messaging).then((token) => {
        // console.log("token : ", token)
        console.log('Your token is:', token);
        setNotificationToken(token)
    }).catch((e) => {
          console.log('Your error is:', e);

      })
      
    //   return token;
    } catch (error) {
      console.error(error);
    }
  }


  const setNotificationToken = (token) => {
    console.log('token set')
    fetch(apiUrl + 'user/setNotificationToken?notificationToken=' + token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('authToken')
      },
    }).then((response) => response.json())
      .then((data) => {
        console.log('task data', data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };





// export const askForPermissionToReceiveNotifications = async () => {
//     try {
//         const app = initializeApp(firebaseConfig);

//         const messaging = getMessaging(app);
//     //   const messaging = messaging();
//       await messaging.requestPermission();
//       const token = await messaging.getToken({vapidKey : "BE69ojSPY3KEzGenQ2eRcxBxzaOax7cJnJx_A6o0O6GTEldYTmyYWS2f_SqdEfsjur6FyxuomVsf62FD6c32VHY"});
//       console.log('Your token is:', token);
      
//       return token;
//     } catch (error) {
//       console.error(error);
//     }
//   }