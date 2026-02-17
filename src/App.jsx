import { useState } from 'react'
import Header from './components/Header/Header.jsx'
import GameBoard from './components/GameBoard/GameBoard.jsx'
import Footer from './components/Footer/Footer.jsx'
import './App.css'

function App() {
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0);

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
    if(newScore > bestScore) {
      setBestScore(newScore);

      if(newScore > bestScore) {
        setBestScore(newScore)
      }
    }
  };

  return (
    <>
      <Header score={score} bestScore={bestScore} />

      <GameBoard onScoreUpdate={handleScoreUpdate} />

      <Footer />

    </>
  )
}

export default App
