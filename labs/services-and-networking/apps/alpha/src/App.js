import React from 'react';
import './App.css';
import { 
  BrowserRouter as Router,
  Route
} from "react-router-dom"
import Home from './components/Home'
import Blue from './components/Blue'

function App() {
  return (
    <main style={{display: 'flex', justifyContent: 'center', background: 'red'}}>
      <div>
        <h2>Hello from alpha</h2>
      </div>
    </main>
  );
}

export default App;
