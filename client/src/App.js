import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import getGoogleOAuthURL from './utils/getGoogleUrl';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className='text-4xl text-red-500'>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href={getGoogleOAuthURL()}
        >
          Google ouath testing
        </a>
      </header>
    </div>
  );
}

export default App;

/*
function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/" component={HomePage} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
*/