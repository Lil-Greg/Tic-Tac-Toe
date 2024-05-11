import { useState } from 'react';
import { TicTacToe } from './components/TicTacToe';
import './index.css';
import { TicTacToePvp } from './components/TicTacToePvp';

export default function App() {
  const [pvp, setPvp] = useState<boolean | null>(null); // Start with false (Player vs. Computer)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Set form display to none and set pvp to whatever user clicks
    event.preventDefault();
  }
  return (
    <div className="container">
      <form className="start" onSubmit={handleSubmit}>
        <h1>Play Against</h1>
        <div className="buttons">
          <button type="button" onClick={() => setPvp(true)}>Player</button>
          <button type="button" onClick={() => setPvp(false)}>Computer</button>
        </div>
      </form>

      {/* After Form Submission */}

      {pvp && ( // Player vs. Player mode
        <TicTacToePvp />
      )}
      {pvp === false && ( // Player vs. Computer mode
        <TicTacToe />
      )}
    </div>
  );
}
