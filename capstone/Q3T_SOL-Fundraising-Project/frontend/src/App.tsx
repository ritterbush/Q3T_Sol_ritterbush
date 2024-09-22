import React from 'react';
import logo from './assets/logo_gravid.png';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome to the Grav.id Fundraising Platform. 
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
         Please Sing up or Sign in
        </a>
      </header>
    </div>
  );
}
