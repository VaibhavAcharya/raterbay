import { Link } from "react-router-dom";

import Logo from "./Logo";

export default function _404() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 p-8">
      <header className="flex flex-col items-center justify-center gap-2">
        <Logo size={48} />
        <h1 className="text-xl font-bold">RaterBay</h1>
      </header>
      <div className="flex flex-col items-start justify-center gap-2 sm:items-center">
        <h2 className="text-6xl font-bold text-red-500">404!</h2>
        <h2 className="text-2xl font-bold">
          You look lost. Where is your mom?
        </h2>
      </div>
      <Link
        to="/dashboard"
        className="animate-bounce rounded-2xl bg-teal-300 px-6 py-3 text-2xl font-bold leading-none"
      >
        ← Go home
      </Link>
    </div>
  );
}
