import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import firebase from 'firebase';
import { initializeFirebase } from './push-notification';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

initializeFirebase();


