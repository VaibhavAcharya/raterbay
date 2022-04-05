import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { useAuth } from "../../db/helpers/auth";

import Footer from "../../components/common/Footer";
import Navbar from "../../components/dashboard/Navbar";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, data, isFetching } = useAuth();

  useEffect(
    function () {
      if (!isFetching && !user && !data) {
        navigate("/");
      }
    },
    [user, data, isFetching]
  );

  if (!isFetching && user && data) {
    return (
      <div className="mx-auto flex w-[min(720px,_100%)] flex-col items-stretch justify-start gap-8 p-8">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    );
  }

  return null;
}
