import React from 'react';
import './App.css';
import './Blocks';
import { Blocks } from './Blocks';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Stack the blocks :D !
      </header>
      <div className="App-content">
        <Blocks></Blocks>
      </div>
    </div>
  );
}

export default App;
