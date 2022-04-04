import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthContextProvider } from "./db/helpers/auth";

import Landing from "./pages/Landing";

import Dashboard from "./pages/dashboard";
import Home from "./pages/dashboard/home";
import Settings from "./pages/dashboard/settings";

import _404 from "./components/common/404";

import "./styles/tailwind.css";

function Root() {
  return (
    <Fragment>
      <div
        className="fixed inset-0 z-[-1] animate-spin-slow opacity-80 blur-[72px]"
        style={{
          background:
            "radial-gradient(circle at top, #FFE6E6 0%, #F2FFE6 25%, #E6FFFF 50%, #E6E6FF 75%, #FFE6FB 100%)",
        }}
      />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<_404 />} />
      </Routes>
    </Fragment>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
