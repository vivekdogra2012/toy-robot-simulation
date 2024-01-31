import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [position, setPosition] = useState({ x: null, y: null, f: null });
  const [directions, setDirections] = useState([]);
  const tableSize = 5;

  const handlePlace = (x, y, f) => {
    if (isValidPosition(x, y)) {
      setPosition({ x, y, f });
    }
  };

  const isValidPosition = (x, y) => {
    return x !== null && y !== null && x >= 0 && x < tableSize && y >= 0 && y < tableSize;
  };

  const handleMove = () => {
    if (position.x === null || position.y === null || position.f === null) return;

    let { x, y, f } = position;

    switch (f) {
      case 'NORTH':
        y = Math.min(y + 1, tableSize - 1);
        break;
      case 'SOUTH':
        y = Math.max(y - 1, 0);
        break;
      case 'EAST':
        x = Math.min(x + 1, tableSize - 1);
        break;
      case 'WEST':
        x = Math.max(x - 1, 0);
        break;
      default:
        break;
    }

    if (isValidPosition(x, y)) {
      setPosition({ x, y, f });
    }
  };

  const handleRotate = (direction) => {
    if (position.f === null) return;

    const directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
    const currentIndex = directions.indexOf(position.f);
    let newIndex;

    if (direction === 'LEFT') {
      newIndex = (currentIndex - 1 + directions.length) % directions.length;
    } else if (direction === 'RIGHT') {
      newIndex = (currentIndex + 1) % directions.length;
    }

    setPosition({ ...position, f: directions[newIndex] });
  };

  const handleReport = () => {
    if (position.x !== null && position.y !== null && position.f !== null) {
      alert(`Current position: X=${position.x}, Y=${position.y}, Facing=${position.f}`);
    }
  };

  const handleCommandSubmit = () => {
    //Example command:  PLACE 0,0,NORTH;MOVE;LEFT;REPORT;
    for (let command of directions) {
      const [action, params] = command.split(' ');
      switch (action) {
        case 'PLACE':
          const [x, y, f] = params.split(',').map((param) => (isNaN(param) ? param : parseInt(param, 10)));
          handlePlace(x, y, f);
          break;
        case 'MOVE':
          handleMove();
          break;
        case 'LEFT':
          handleMove();
          break;
        case 'RIGHT':
          handleRotate(action);
          break;
        case 'REPORT':
          handleReport();
          break;
        default:
          break;
      }
    }
  };

  const handleInputChange = (event) => {
    setDirections(event.target.value.split(';').map((command) => command.trim()));
    console.log(directions);
  };

  return (
    <div className="App">
      <h1>Toy Robot Simulation</h1>
      <div className="commands-container">
        <textarea
          placeholder="Enter commands here..."
          onChange={handleInputChange}
          value={directions.join(';')}
        />
        <button onClick={handleCommandSubmit}>Submit</button>
      </div>
      <div className="robot-table">
        <div className="robot" style={{ left: position.x * 40, bottom: position.y * 40 }}>
          {position.f && <div className={`arrow arrow-${position.f.toLowerCase()}`} />}
        </div>
      </div>
    </div>
  );
};

export default App;
