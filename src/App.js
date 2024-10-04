import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHandRock, FaHandPaper, FaHandScissors } from "react-icons/fa";
import "tailwindcss/tailwind.css";

const options = [
  { name: "stone", icon: <FaHandRock size={50} /> },
  { name: "paper", icon: <FaHandPaper size={50} /> },
  { name: "scissors", icon: <FaHandScissors size={50} /> },
];

const App = () => {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [player1Choice, setPlayer1Choice] = useState("");
  const [player2Choice, setPlayer2Choice] = useState("");
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [turn, setTurn] = useState(""); // Track whose turn it is
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false); // Track game start
  const [showFinalResult, setShowFinalResult] = useState(false); // Show final result card

  // Determine winner logic
  const determineWinner = (choice1, choice2) => {
    if (choice1 === choice2) return "Tie";
    if (
      (choice1 === "stone" && choice2 === "scissors") ||
      (choice1 === "scissors" && choice2 === "paper") ||
      (choice1 === "paper" && choice2 === "stone")
    ) {
      return player1Name;
    }
    return player2Name;
  };

  // Automatically calculate winner and move to next round
  useEffect(() => {
    if (player1Choice && player2Choice) {
      handleNextRound();
    }
  }, [player1Choice, player2Choice]);

  // Handle the next round
  const handleNextRound = () => {
    const roundWinner = determineWinner(player1Choice, player2Choice);
    const newRounds = [
      ...rounds,
      {
        round: currentRound,
        player1Choice,
        player2Choice,
        winner: roundWinner,
      },
    ];
    setRounds(newRounds);
    handleSubmitGame();

    toast.success(
      roundWinner === "Tie"
        ? `Round ${currentRound}: It's a Tie!`
        : `Round ${currentRound}: ${roundWinner} wins!`
    );

    if (currentRound === 6) {
      setGameOver(true);
      const player1Wins = newRounds.filter(
        (r) => r.winner === player1Name
      ).length;
      const player2Wins = newRounds.filter(
        (r) => r.winner === player2Name
      ).length;
      if (player1Wins > player2Wins) setWinner(player1Name);
      else if (player2Wins > player1Wins) setWinner(player2Name);
      else setWinner("Tie");
    } else {
      setCurrentRound(currentRound + 1);
      setPlayer1Choice("");
      setPlayer2Choice("");
      setTurn("player1"); // Reset turn to Player 1
    }
  };

  // Handle game submission
  const handleSubmitGame = async () => {
    try {
      await axios.post("http://localhost:5000/game", {
        player1Name,
        player2Name,
        rounds,
      });
      toast.success("Game saved successfully!");
    } catch (error) {
      toast.error("Error saving game.");
    }
  };

  // Restart the game
  const handleRestartGame = () => {
    setPlayer1Choice("");
    setPlayer2Choice("");
    setRounds([]);
    setCurrentRound(1);
    setGameOver(false);
    setShowFinalResult(false);
    setTurn("player1");
  };

  // Ensure that once names are entered, the game starts
  const handleStartGame = () => {
    if (player1Name && player2Name) {
      setTurn("player1");
      setGameStarted(true); // Start the game
    } else {
      toast.error("Please enter names for both players.");
    }
  };

  // Initial page for entering names
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-blue-500">
        <h1 className="text-4xl font-bold text-white mb-8">
          Enter Player Names
        </h1>
        <input
          className="mb-4 p-2 border border-white rounded-lg w-64 text-gray-800"
          placeholder="Player 1 Name"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
        />
        <input
          className="mb-4 p-2 border border-white rounded-lg w-64 text-gray-800"
          placeholder="Player 2 Name"
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
        />
        <button
          className="bg-white text-purple-500 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:bg-purple-500 hover:text-white"
          onClick={handleStartGame}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Final Result Card */}
      {showFinalResult && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-green-500">
            🎉 Congratulations,{" "}
            {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`} 🎉
          </h1>
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-lg mt-4 transition duration-300 ease-in-out transform hover:bg-blue-600"
            onClick={handleRestartGame}
          >
            Restart Game
          </button>
        </div>
      )}

      {/* Show game board if not gameOver */}
      {!gameOver && (
        <>
          <h1 className="text-3xl font-bold mb-4">Round {currentRound}</h1>
          <h2 className="text-xl font-bold mb-4">
            {turn === "player1"
              ? `${player1Name}'s turn`
              : `${player2Name}'s turn`}
          </h2>

          <div className="flex justify-around w-full max-w-2xl mb-8">
            {/* Player 1 options */}
            <div
              className={`text-center p-4 rounded-lg ${
                turn === "player1" ? "bg-blue-200" : "bg-white"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-2">{player1Name}</h2>
              <div className="flex space-x-2">
                {options.map((option) => (
                  <button
                    key={option.name}
                    className="p-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                    onClick={() => {
                      if (turn === "player1") {
                        setPlayer1Choice(option.name);
                        setTurn("player2"); // Switch turn to Player 2
                      }
                    }}
                    disabled={turn !== "player1"} // Disable if not player1's turn
                  >
                    {option.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Player 2 options */}
            <div
              className={`text-center p-4 rounded-lg ${
                turn === "player2" ? "bg-red-200" : "bg-white"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-2">{player2Name}</h2>
              <div className="flex space-x-2">
                {options.map((option) => (
                  <button
                    key={option.name}
                    className="p-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                    onClick={() => {
                      if (turn === "player2") {
                        setPlayer2Choice(option.name);
                      }
                    }}
                    disabled={turn !== "player2"} // Disable if not player2's turn
                  >
                    {option.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {gameOver ? (
        <button
          className="bg-purple-500 text-white font-bold py-2 px-6 rounded-lg mb-4 transition duration-300 ease-in-out transform hover:bg-purple-600"
          onClick={() => setShowFinalResult(true)}
        >
          Final Result
        </button>
      ) : null}

      {/* Show score card if rounds exist */}
      {rounds.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-2">Score</h2>
          <ul className="text-lg">
            {rounds.map((round, index) => (
              <li key={index} className="mb-2">
                Round {round.round}:{" "}
                {round.winner === "Tie"
                  ? "It's a Tie!"
                  : `${round.winner} won!`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
