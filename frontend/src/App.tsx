export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-950 text-slate-50">
      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="text-5xl animate-bounce">🚗 🚙 🚐</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          KATA
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Phase 1 done (written by karan 100% no ai)
        </p>
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 mx-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Phase 1 completed.
        </div>
      </div>
    </div>
  );
}
