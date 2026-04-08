import React, {useState, useEffect} from "react";
import {getLeaderboard, getChampionPrediction} from "../api";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [champions, setChampions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await getLeaderboard();
      // Filtrar administradores
      const filtered = Array.isArray(response.data)
        ? response.data.filter((entry) => !entry.is_admin)
        : [];
      setLeaderboard(filtered);
      // Fetch champion predictions for each user
      const championResults = await Promise.all(
        filtered.map(async (entry) => {
          try {
            const res = await getChampionPrediction(entry.id);
            return {userId: entry.id, team: res.data.team};
          } catch {
            return {userId: entry.id, team: null};
          }
        }),
      );
      const championMap = {};
      championResults.forEach((c) => {
        championMap[c.userId] = c.team;
      });
      setChampions(championMap);
      setLoading(false);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      setLoading(false);
    }
  };

  const getMedalEmoji = (position) => {
    if (position === 0) return "🥇";
    if (position === 1) return "🥈";
    if (position === 2) return "🥉";
    return "";
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8 text-white text-center">
        🏆 Leaderboard
      </h1>

      <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
        {leaderboard.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            No data available in the leaderboard
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm sm:text-base">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left py-4 px-6 text-slate-400 font-bold text-sm uppercase tracking-wider">
                    #
                  </th>
                  <th className="text-left py-4 px-6 text-slate-400 font-bold text-sm uppercase tracking-wider">
                    Player Name
                  </th>
                  <th className="text-left py-4 px-6 text-slate-400 font-bold text-sm uppercase tracking-wider">
                    Company
                  </th>
                  <th className="text-center py-4 px-6 text-slate-400 font-bold text-sm uppercase tracking-wider">
                    Points
                  </th>
                  <th className="text-center py-4 px-6 text-slate-400 font-bold text-sm uppercase tracking-wider">
                    Champion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {leaderboard.map((entry, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-slate-700/50 transition-colors ${
                      index < 3 ? "bg-slate-700/20" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-lg ${index === 0 ? "text-yellow-400" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-600" : "text-slate-500"}`}
                        >
                          {index + 1}
                        </span>
                        {getMedalEmoji(index) && (
                          <span className="text-2xl">
                            {getMedalEmoji(index)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-bold text-white ${index < 3 ? "text-lg" : ""}`}
                      >
                        {entry.username}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-300 font-medium">
                        {entry.empresa || "-"}
                      </span>
                    </td>
                    {/* Puntos */}
                    <td className="text-center py-4 px-6">
                      <span className="text-2xl font-black text-green-400">
                        {entry.total_points}
                      </span>
                    </td>
                    <td className="text-center py-4 px-6">
                      <span className="font-bold text-yellow-300">
                        {champions[entry.id] ? (
                          <>
                            <span className="text-2xl mr-1">👑</span>
                            {champions[entry.id]}
                          </>
                        ) : (
                          <span className="text-slate-500 italic">-</span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 bg-slate-800/50 p-4 sm:p-6 rounded-xl border border-slate-700 text-sm sm:text-base">
        <h3 className="font-bold mb-3 text-white text-lg">
          🏆 Official Scoring System
        </h3>
        <div className="space-y-4 text-slate-300">
          <div>
            <span className="font-bold text-white">⚽ Group Stage</span>
            <ul className="list-disc ml-6">
              <li>5 points for an exact score.</li>
              <li>
                3 points for predicting the winner or a draw (without matching the exact score).
              </li>
              <li>
                1 point for predicting only one of the goals in the score (partial result).
              </li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-white">
              🔥 Round of 32
            </span>
            <ul className="list-disc ml-6">
              <li>6 points for an exact score.</li>
              <li>3 points for predicting the winner or a draw.</li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-white">🔥 Round of 16</span>
            <ul className="list-disc ml-6">
              <li>7 points for an exact score.</li>
              <li>4 points for predicting the winner or a draw.</li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-white">🔥 Quarterfinals</span>
            <ul className="list-disc ml-6">
              <li>9 points for an exact score.</li>
              <li>5 points for predicting the winner or a draw.</li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-white">🔥 Semifinals</span>
            <ul className="list-disc ml-6">
              <li>12 points for an exact score.</li>
              <li>6 points for predicting the winner or a draw.</li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-white">🥉 Third Place</span>
            <ul className="list-disc ml-6">
              <li>10 points for an exact score.</li>
              <li>5 points for predicting the winner or a draw.</li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-white">🏆 Final</span>
            <ul className="list-disc ml-6">
              <li>15 points for an exact score.</li>
              <li>8 points for predicting the winner or a draw.</li>
            </ul>
          </div>
          <div>
            <span className="font-bold text-white">👑 World Champion</span>
            <ul className="list-disc ml-6">
              <li>15 additional points for predicting the tournament champion.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
