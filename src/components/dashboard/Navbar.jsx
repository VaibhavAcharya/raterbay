import { Link } from "react-router-dom";

import Logo from "../common/Logo";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="flex flex-row items-end justify-between gap-4">
      <Link
        to="."
        className="flex flex-row flex-wrap items-center justify-start gap-2"
      >
        <Logo size={28} />
        <h1 className="font-bold">RaterBay</h1>
      </Link>

      <nav className="flex flex-row flex-wrap items-center justify-end gap-x-4 gap-y-2 font-bold">
        <NavLink
          to="."
          end
          style={function ({ isActive }) {
            return {
              ...(isActive ? { display: "none" } : {}),
            };
          }}
        >
          ← Dashboard
        </NavLink>
        <NavLink
          to="settings"
          style={function ({ isActive }) {
            return {
              ...(isActive ? { display: "none" } : {}),
            };
          }}
        >
          Settings →
        </NavLink>
      </nav>
    </header>
  );
}
