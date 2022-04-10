import { Fragment, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  query,
  collection,
  orderBy,
  limit,
  getDocs,
  startAfter,
  where,
  Timestamp,
} from "firebase/firestore";

import { firestore } from "../../db";
import { useAuth } from "../../db/helpers/auth";

import InfiniteScroll from "react-infinite-scroll-component";

import ResumeCard from "../../components/dashboard/ResumeCard";

const usersCollectionRef = collection(firestore, "users");

const FETCH_USERS_FIRST_COUNT = 3;
const FETCH_USERS_MORE_COUNT = 2;

function getStartOfToday() {
  const now = new Date();
  now.setHours(5); // +5 hours for Eastern Time
  const timestamp = Timestamp.fromDate(now);
  return timestamp; // ex. 1631246400
}

export default function Home() {
  const { data } = useAuth();

  const [users, setUsers] = useState([]);

  const [lastUserDocFetched, setLastUserDocFetched] = useState(null);
  const [hasMoreUserDocs, setHasMoreUserDocs] = useState(true);

  const [showLatest, setShowLatest] = useState(false);
  function setLatestQ() {
    setShowLatest(true);
  }
  function setTopQ() {
    setShowLatest(false);
  }

  useEffect(
    function () {
      console.log("Users fetch started. [first]");
      const latestQuery = query(
        usersCollectionRef,
        orderBy("resume.updatedAt", "desc"),
        // where("resume.updatedAt", ">", getStartOfToday()),
        limit(FETCH_USERS_FIRST_COUNT)
      );

      const topQuery = query(
        usersCollectionRef,
        // where("resume.updatedAt", ">", getStartOfToday()),
        orderBy("resume.rating.total", "desc"),
        orderBy("resume.updatedAt", "desc"),
        limit(FETCH_USERS_FIRST_COUNT)
      );

      getDocs(showLatest ? latestQuery : topQuery)
        .then((usersSnap) => {
          console.log("Users fetched successfully. [first]", usersSnap.size);

          setLastUserDocFetched(usersSnap.docs[usersSnap.size - 1]);
          setUsers(
            usersSnap.docs.map(function (userDoc) {
              return {
                id: userDoc.id,
                ...userDoc.data(),
              };
            })
          );
        })
        .catch(function (error) {
          console.error("Users fetch failed! [first]", error);
        });
    },
    [showLatest]
  );

  const loadMoreUsers = useCallback(
    function () {
      console.log("Users fetch started. [more]");

      const latestQuery = query(
        usersCollectionRef,
        orderBy("resume.updatedAt", "desc"),
        // where("resume.updatedAt", ">", getStartOfToday()),
        startAfter(lastUserDocFetched),
        limit(FETCH_USERS_MORE_COUNT)
      );

      const topQuery = query(
        usersCollectionRef,
        // where("resume.updatedAt", ">", getStartOfToday()),
        orderBy("resume.rating.total", "desc"),
        orderBy("resume.updatedAt", "desc"),
        startAfter(lastUserDocFetched),
        limit(FETCH_USERS_FIRST_COUNT)
      );

      getDocs(showLatest ? latestQuery : topQuery)
        .then(function (moreUsersSnap) {
          console.log("Users fetched successfully. [more]");

          const moreUsersSnapSize = moreUsersSnap.size;

          if (moreUsersSnapSize < 1) {
            console.log("No more users to fetch.");

            setHasMoreUserDocs(false);
          } else {
            setLastUserDocFetched(moreUsersSnap.docs[moreUsersSnapSize]);

            const newUsers = moreUsersSnap.docs.map(function (userDoc) {
              return {
                id: userDoc.id,
                ...userDoc.data(),
              };
            });

            setUsers(function (oldUsers) {
              return [...oldUsers, ...newUsers];
            });
          }
        })
        .catch(function (error) {
          console.error("Users fetch failed! [more]", error);
        });
    },
    [showLatest]
  );

  return (
    <Fragment>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <button
          className={[
            "rounded-2xl px-4 py-2 font-bold hover:bg-teal-100",
            showLatest ? "" : "bg-teal-200",
          ].join(" ")}
          onClick={setTopQ}
        >
          Top
        </button>
        <button
          className={[
            "rounded-2xl px-4 py-2 font-bold hover:bg-teal-100",
            showLatest ? "bg-teal-200" : "",
          ].join(" ")}
          onClick={setLatestQ}
        >
          Latest
        </button>
      </div>
      <InfiniteScroll
        dataLength={users.length}
        next={loadMoreUsers}
        hasMore={hasMoreUserDocs}
        loader={
          <div className="flex flex-col items-stretch justify-start gap-4">
            {Array(FETCH_USERS_MORE_COUNT).map(function (_, i) {
              return (
                <div
                  key={i}
                  className="h-[60vh] animate-pulse bg-black/20 blur"
                />
              );
            })}
          </div>
        }
        endMessage={
          <div className="border-b border-dashed border-black pt-8" />
        }
      >
        <main>
          {users.map((user) => {
            if (user.resume.url) {
              return <ResumeCard key={user.id} user={user} />;
            }

            return null;
          })}
        </main>
      </InfiniteScroll>

      {data.resume?.url ? null : (
        <div className="fixed left-0 bottom-8 flex w-full flex-row items-center justify-center">
          <Link
            to="settings"
            className=" flex animate-bounce flex-row items-center justify-center gap-4 rounded-2xl bg-teal-300 px-6 py-3 text-xl font-bold leading-none disabled:animate-ping disabled:cursor-not-allowed disabled:opacity-60"
          >
            Upload your resume
          </Link>
        </div>
      )}
    </Fragment>
  );
}
