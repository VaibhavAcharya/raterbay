import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  query,
  collection,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";

import { useAuth } from "../../db/helpers/auth";
import { firestore } from "../../db";
import ResumeCard from "../../components/dashboard/ResumeCard";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const { data } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [lastVisible, setlastVisible] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(async () => {
    const q = query(
      collection(firestore, "users"),
      orderBy("resume.updatedAt", "desc"),
      limit(3)
    );

    await getDocs(q).then((snapshot) => {
      var lastVisible = snapshot.docs[snapshot.size - 1];
      setlastVisible(lastVisible);
      const tempResume = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResumes(tempResume);
    });
  }, []);

  const nextIndex = () => {
    const q = query(
      collection(firestore, "users"),
      orderBy("resume.updatedAt", "desc"),
      startAfter(lastVisible),
      limit(2)
    );
    getDocs(q).then((snapshot) => {
      if (snapshot.size === 0) {
        setHasMore(false);
      } else {
        var lastVisible = snapshot.docs[snapshot.size - 1];
        setlastVisible(lastVisible);
        const tempResume = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResumes([...resumes, ...tempResume]);
      }
    });
  };

  return (
    <Fragment>
      <InfiniteScroll
        dataLength={resumes.length}
        next={nextIndex}
        hasMore={hasMore}
        loader={<p>loadinggggggg.........</p>}
        endMessage={<h4>The Endd.</h4>}
      >
        <main>
          {resumes &&
            resumes.map((resume) => {
              if (resume.resume.url) {
                return <ResumeCard resume={resume} />;
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
