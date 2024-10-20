import React, { useEffect, useState } from "react";
import axios from "axios";

const GameHistory = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://13.235.75.88/games");
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="min-h-screen  p-6">
      <h1 className="text-3xl font-bold mb-6">Game History</h1>
      {games.length === 0 ? (
        <p>No games have been played yet.</p>
      ) : (
        <table className="w-full table-auto shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-purple-700">
              <th className="px-4 py-2">Game ID</th>
              <th className="px-4 py-2">Player 1</th>
              <th className="px-4 py-2">Player 2</th>
              <th className="px-4 py-2">Winner</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td className="border px-4 py-2">{game.id}</td>
                <td className="border px-4 py-2">{game.player1_name}</td>
                <td className="border px-4 py-2">{game.player2_name}</td>
                <td className="border px-4 py-2">{game.winner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GameHistory;
