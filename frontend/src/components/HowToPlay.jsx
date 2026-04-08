import React from "react";

export default function HowToPlay() {
  const knockoutRows = [
    ["Round of 32", "6 pts", "3 pts"],
    ["Round of 16", "7 pts", "4 pts"],
    ["Quarterfinals", "9 pts", "5 pts"],
    ["Semifinals", "12 pts", "6 pts"],
    ["Third Place", "10 pts", "5 pts"],
    ["Final", "15 pts", "8 pts"],
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-900/85 p-3 sm:p-6 md:p-10 shadow-2xl">
      <div className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto text-sm sm:text-base">
        <div className="mb-8 flex items-center gap-4">
          <img
            src="/img/integ.png"
            alt="INTEG"
            className="h-16 w-16 rounded-xl bg-white object-contain p-1 shadow"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-yellow-400">
              🏆 INTEG World Cup 2026 Contest
            </h1>
            <p className="mt-1 text-cyan-200 font-semibold">Quick Rules</p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-300 mb-3">
            ⚽ How to participate
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-100">
            <li>Register on the platform with your details.</li>
            <li>Submit your score prediction for each match.</li>
            <li>You can edit your prediction up to 5 minutes before kickoff.</li>
            <li>Once the match starts, the prediction is locked.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-300 mb-3">
            🧮 Scoring System
          </h2>

          <h3 className="text-lg font-bold text-cyan-200 mb-2">⚽ Group Stage</h3>
          <ul className="list-disc pl-6 space-y-1 text-slate-100 mb-5">
            <li>5 pts → Exact score</li>
            <li>3 pts → Correct winner or draw</li>
            <li>1 pt → Correct goals for one team</li>
          </ul>

          <h3 className="text-lg font-bold text-cyan-200 mb-3">🔥 Knockout Phases</h3>
          <p className="text-slate-100 mb-3">
            If you predict a draw, indicate the expected score after extra time and then select the team you expect to win on penalties.
          </p>
          <div className="overflow-x-auto rounded-xl border border-cyan-400/30">
            <table className="w-full min-w-[320px] sm:min-w-[520px] text-left text-xs sm:text-base">
              <thead className="bg-cyan-700/35 text-cyan-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Phase</th>
                  <th className="px-4 py-3 font-bold">Exact Score</th>
                  <th className="px-4 py-3 font-bold">Winner</th>
                </tr>
              </thead>
              <tbody>
                {knockoutRows.map(([phase, exactScore, winner]) => (
                  <tr key={phase} className="border-t border-cyan-400/20 text-slate-100">
                    <td className="px-4 py-3">{phase}</td>
                    <td className="px-4 py-3">{exactScore}</td>
                    <td className="px-4 py-3">{winner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-300 mb-3">
            👑 World Champion
          </h2>
          <p className="text-slate-100">If you guess the tournament champion:</p>
          <p className="mt-2 text-yellow-400 font-extrabold text-lg">🏆 +15 bonus points</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-300 mb-3">
            📊 Leaderboard
          </h2>
          <p className="text-slate-100 mb-3">
            The leaderboard updates automatically after each match.
          </p>
          <p className="text-slate-100">In case of a tie:</p>
          <ol className="list-decimal pl-6 mt-2 space-y-1 text-slate-100">
            <li>1 More exact scores</li>
            <li>2 More correct winners</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-300 mb-3">
            ⚠️ Rules
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-100">
            <li>Only one account per player.</li>
            <li>
              Fraudulent predictions or multiple accounts will be disqualified.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl md:text-2xl font-bold text-emerald-300 mb-3">
            📩 Contact
          </h2>
          <p className="text-slate-100">
            If you have questions or complaints, write to{" "}
            <a
              href="mailto:alemanfausto@gmail.com"
              className="font-bold text-cyan-300 underline hover:text-cyan-200"
            >
              quinimundial@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
