// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';

function App() {
  const [articles, setArticles] = useState([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch('https://api.thenewsapi.com/v1/news/all?api_token=tXgJTccPK3RrbBgzJmklOhIaYq5XJ6yOXwdnJuTw&language=en&limit=3')
      .then(response => response.json())
      .then(data => setArticles(data.data))
      .catch(error => console.error('Error fetching news:', error));

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User logged in:', user);
        setUser(user);
      } else {
        console.log('User logged out');
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        setUser(userCredential.user);
        setLoginModalOpen(false);
      })
      .catch(error => console.error('Error logging in:', error.message));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        updateProfile(userCredential.user, { displayName })
          .then(() => {
            setUser(userCredential.user);
            setSignupModalOpen(false);
          })
          .catch(error => console.error('Error updating profile:', error.message));
      })
      .catch(error => console.error('Error signing up:', error.message));
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch(error => console.error('Error logging out:', error.message));
  };

  const getInitial = (email) => email ? email.charAt(0).toUpperCase() : '';

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className="App">
      <header>
        <div className="logo-title">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
            <path d="M18,21H6c-1.105,0-2-0.895-2-2v-7c0-1.105,0.895-2,2-2h12c1.105,0,2,0.895,2,2v7C20,20.105,19.105,21,18,21z" opacity=".35"></path>
            <path d="M18,10H6c-0.552,0-1-0.448-1-1V5c0-1.105,0.895-2,2-2h10c1.105,0,2,0.895,2,2v4C19,9.552,18.552,10,18,10z" opacity=".35"></path>
            <path d="M20.53,8.857l-3.061-0.857L16.88,6.452c-0.392-1.033-1.547-1.552-2.58-1.159L3.083,9.555 c-1.033,0.392-1.552,1.547-1.159,2.58L4,17.601V12c0-1.105,0.895-2,2-2h12c1.105,0,2,0.895,2,2v6.172l1.917-6.849 C22.214,10.259,21.593,9.155,20.53,8.857z"></path>
            <path d="M9.5,18.75c-1.792,0-3.25-1.458-3.25-3.25s1.458-3.25,3.25-3.25c0.621,0,1.225,0.176,1.746,0.509 c0.35,0.223,0.452,0.687,0.229,1.036c-0.222,0.348-0.685,0.451-1.035,0.229c-0.28-0.179-0.605-0.273-0.939-0.273 c-0.965,0-1.75,0.785-1.75,1.75s0.785,1.75,1.75,1.75c0.696,0,1.3-0.409,1.581-1h-0.95c-0.414,0-0.75-0.336-0.75-0.75 s0.336-0.75,0.75-0.75H12c0.414,0,0.75,0.336,0.75,0.75C12.75,17.292,11.292,18.75,9.5,18.75z"></path>
            <path d="M17,15h-2c-0.553,0-1-0.448-1-1s0.447-1,1-1h2c0.553,0,1,0.448,1,1S17.553,15,17,15z"></path>
            <path d="M17,18h-2c-0.553,0-1-0.448-1-1s0.447-1,1-1h2c0.553,0,1,0.448,1,1S17.553,18,17,18z"></path>
          </svg>
          <h1>DailyPulse News</h1>
        </div>
        <nav>
          <ul>
            {user ? (
              <li>
                <div className="profile-icon">{getInitial(user.email)}</div>
                <button onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li><button onClick={() => setLoginModalOpen(true)}>Login</button></li>
                <li><button onClick={() => setSignupModalOpen(true)}>Sign Up</button></li>
              </>
            )}
            <li className="toggle-switch">
              <input type="checkbox" id="darkModeToggle" checked={darkMode} onChange={toggleDarkMode} />
              <label htmlFor="darkModeToggle"></label>
            </li>
          </ul>
        </nav>
      </header>
      <div className="container">
        <div className="news-grid">
          {articles.map((article, index) => {
            try {
              if (!article.title || !article.description || !article.url) {
                throw new Error("Missing article data");
              }
              return (
                <div className="news-item" key={index}>
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
              );
            } catch (error) {
              console.error(`Error rendering article at index ${index}:`, error);
              return (
                <div className="news-item" key={index}>
                  <h2>Error loading article</h2>
                  <p>There was an error loading this article. Please try again later.</p>
                </div>
              );
            }
          })}
        </div>
      </div>
      <footer>
        <p>&copy; 2024 Dailypuls News. All rights reserved.</p>
      </footer>

      {loginModalOpen && (
        <div className="modal" onClick={() => setLoginModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setLoginModalOpen(false)}>&times;</span>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      )}

      {signupModalOpen && (
        <div className="modal" onClick={() => setSignupModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setSignupModalOpen(false)}>&times;</span>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
              <label htmlFor="displayName">Display Name</label>
              <input type="text" id="displayName" name="displayName" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
