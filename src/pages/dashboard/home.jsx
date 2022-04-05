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
  now.setHours(5, 0, 0, 0); // +5 hours for Eastern Time
  const timestamp = Timestamp.fromDate(now);
  return timestamp; // ex. 1631246400
}

export default function Home() {
  const { data } = useAuth();

  const [users, setUsers] = useState([]);

  const [lastUserDocFetched, setLastUserDocFetched] = useState(null);
  const [hasMoreUserDocs, setHasMoreUserDocs] = useState(true);

  useEffect(function () {
    console.log("Users fetch started. [first]");
    const latestQuery = query(
      usersCollectionRef,
      orderBy("resume.updatedAt", "desc"),
      where("resume.updatedAt", ">", getStartOfToday()),
      limit(FETCH_USERS_FIRST_COUNT)
    );

    const topQuery = query(
      usersCollectionRef,
      orderBy("resume.updatedAt", "desc"),
      where("resume.updatedAt", ">", getStartOfToday()),
      orderBy("resume.rating.total", "desc"),
      limit(FETCH_USERS_FIRST_COUNT)
    );

    getDocs(topQuery)
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
  }, []);

  const loadMoreUsers = useCallback(function () {
    console.log("Users fetch started. [more]");

    getDocs(
      query(
        usersCollectionRef,
        orderBy("resume.updatedAt", "desc"),
        startAfter(lastUserDocFetched),
        limit(FETCH_USERS_MORE_COUNT)
      )
    )
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
  }, []);

  console.log(users);

  return (
    <Fragment>
      <InfiniteScroll
        dataLength={users.length}
        next={loadMoreUsers}
        hasMore={hasMoreUserDocs}
        loader={<p>loadinggggggg.........</p>}
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

      {data.resume.url ? null : (
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
