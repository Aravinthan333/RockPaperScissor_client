import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FaHandRock, FaHandPaper, FaHandScissors } from "react-icons/fa";
import GameHistory from "./GameHistory";

const App = () => {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [winner, setWinner] = useState(null);
  const [showWinnerCard, setShowWinnerCard] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);

  const choices = [
    { name: "Rock", icon: <FaHandRock /> },
    { name: "Paper", icon: <FaHandPaper /> },
    { name: "Scissors", icon: <FaHandScissors /> },
  ];

  const determineRoundWinner = (player1Choice, player2Choice) => {
    if (player1Choice === player2Choice) return "Tie";
    if (
      (player1Choice === "Rock" && player2Choice === "Scissors") ||
      (player1Choice === "Paper" && player2Choice === "Rock") ||
      (player1Choice === "Scissors" && player2Choice === "Paper")
    )
      return player1Name;
    return player2Name;
  };

  const playRound = () => {
    const roundWinner = determineRoundWinner(player1Choice, player2Choice);
    const newRound = {
      round: currentRound,
      player1Choice,
      player2Choice,
      winner: roundWinner,
    };

    setRounds([...rounds, newRound]);
    setPlayer1Choice(null);
    setPlayer2Choice(null);

    if (currentRound === 6) {
      endGame();
    } else {
      setCurrentRound(currentRound + 1);
    }
  };

  const endGame = async () => {
    try {
      const finalWinner =
        rounds.filter((r) => r.winner === player1Name).length >
        rounds.filter((r) => r.winner === player2Name).length
          ? player1Name
          : player2Name;

      setWinner(finalWinner);
      setShowWinnerCard(true);
      setIsGameEnded(true);

      await axios.post("http://3.108.55.156/api/game", {
        player1Name,
        player2Name,
        rounds,
        winner: finalWinner,
      });
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const resetGame = () => {
    setPlayer1Name("");
    setPlayer2Name("");
    setRounds([]);
    setCurrentRound(1);
    setWinner(null);
    setShowWinnerCard(false);
    setIsGameEnded(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-purple-700 via-blue-600 to-indigo-900 text-white p-6 font-sans">
        <nav className="mb-6">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-yellow-300 hover:text-yellow-400">
                Play Game
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                className="text-yellow-300 hover:text-yellow-400"
              >
                Game History
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/history" element={<GameHistory />} />
          <Route
            path="/"
            element={
              <div className="game-container text-center">
                {showWinnerCard && (
                  <div className="bg-yellow-500 text-black text-xl font-bold p-4 rounded-md mb-6 shadow-lg">
                    🎉 {winner} is the Champion! 🎉
                  </div>
                )}

                <h1 className="text-4xl font-extrabold mb-8">
                  Rock Paper Scissors
                </h1>

                {!isGameEnded ? (
                  <>
                    {currentRound <= 6 && (
                      <>
                        <div className="player-names grid grid-cols-2 gap-4 mb-6">
                          <div className="p-4 border-2 rounded-lg">
                            <label className="block mb-2">Player 1 Name</label>
                            <input
                              type="text"
                              value={player1Name}
                              onChange={(e) => setPlayer1Name(e.target.value)}
                              className="border p-2 w-full text-black"
                              placeholder="Enter Player 1 Name"
                            />
                          </div>

                          <div className="p-4 border-2 rounded-lg">
                            <label className="block mb-2">Player 2 Name</label>
                            <input
                              type="text"
                              value={player2Name}
                              onChange={(e) => setPlayer2Name(e.target.value)}
                              className="border p-2 w-full text-black"
                              placeholder="Enter Player 2 Name"
                            />
                          </div>
                        </div>

                        <div className="choices flex justify-center space-x-8 mb-6">
                          <div className="text-center">
                            <h2 className="text-2xl mb-2">Player 1 Choice</h2>
                            {choices.map((choice) => (
                              <button
                                key={choice.name}
                                onClick={() => setPlayer1Choice(choice.name)}
                                className="p-4 rounded-full text-3xl bg-gray-700 hover:bg-gray-600"
                              >
                                {choice.icon}
                              </button>
                            ))}
                          </div>

                          <div className="text-center">
                            <h2 className="text-2xl mb-2">Player 2 Choice</h2>
                            {choices.map((choice) => (
                              <button
                                key={choice.name}
                                onClick={() => setPlayer2Choice(choice.name)}
                                className="p-4 rounded-full text-3xl bg-gray-700 hover:bg-gray-600"
                              >
                                {choice.icon}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={playRound}
                          disabled={!player1Choice || !player2Choice}
                          className="bg-green-500 hover:bg-green-400 text-white p-3 rounded-lg"
                        >
                          Play Round
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="mt-6">
                    <button
                      onClick={resetGame}
                      className="bg-red-500 hover:bg-red-400 text-white p-3 rounded-lg"
                    >
                      Restart Game
                    </button>
                  </div>
                )}

                {rounds.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-4">Game Rounds</h2>
                    <ul className="space-y-4">
                      {rounds.map((round, index) => (
                        <li
                          key={index}
                          className="p-4 bg-gray-800 rounded-lg shadow-md"
                        >
                          Round {round.round}: Player 1 chose{" "}
                          <span className="font-bold">
                            {round.player1Choice}
                          </span>{" "}
                          vs. Player 2 chose{" "}
                          <span className="font-bold">
                            {round.player2Choice}
                          </span>{" "}
                          -{" "}
                          {round.winner === "Tie"
                            ? "It's a Tie"
                            : `${round.winner} Wins`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
