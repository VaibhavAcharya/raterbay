import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { AuthSwitch, signInWithGoogle, useAuth } from "../db/helpers/auth";

import Logo from "../components/common/Logo";
import Footer from "./../components/common/Footer";

export default function Landing() {
  const navigate = useNavigate();
  const { user, isFetching } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-stretch justify-between gap-8 p-8">
      <header className="flex flex-col items-center justify-center gap-2">
        <Logo size={48} />
        <h1 className="text-xl font-bold">RaterBay</h1>
      </header>
      <main className="flex flex-col items-center justify-start gap-16">
        <h2 className="text-4xl font-bold sm:text-center">
          A platform for receiving and providing{" "}
          <u className="decoration-teal-400 decoration-wavy">resume reviews</u>.
        </h2>
        <button
          onClick={
            user
              ? function () {
                  navigate("/dashboard");
                }
              : signInWithGoogle
          }
          className="flex animate-bounce flex-row items-center justify-center gap-4 rounded-2xl bg-teal-300 px-6 py-3 text-2xl font-bold leading-none disabled:animate-ping disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isFetching}
        >
          <AuthSwitch
            whileFetching={"Wait..."}
            whenIsNotUser={
              <Fragment>
                <img
                  src="/icons/google.svg"
                  alt="logo google"
                  loading="lazy"
                  decoding="async"
                  width={18}
                  height={18}
                />
                <span>Let's go!</span>
              </Fragment>
            }
            whenIsUser={"Dashboard →"}
          />
        </button>
      </main>
      <Footer />
    </div>
  );
}
