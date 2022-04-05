import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { firestore } from "../../db";
import { useAuth } from "../../db/helpers/auth";

import ResumeViewer from "../common/ResumeViewer";

export default function ResumeCard({ user: resume }) {
  const [rating, setRating] = useState(2);
  const [totalRating, setTotalRating] = useState(2);
  const [alreadyRating, setAlreadyRating] = useState(false);
  const { user } = useAuth();

  useEffect(async () => {
    const q = doc(firestore, `users/${resume.id}/ratings/count`);
    const alreadyRatingRef = doc(
      firestore,
      `users/${resume.id}/ratings/${user.uid}`
    );
    await getDoc(q).then((snapshot) => {
      setRating(snapshot.data().count);
      setTotalRating(snapshot.data().totalRating);
    });
    await getDoc(alreadyRatingRef).then((snapshot) => {
      setAlreadyRating(snapshot.data().rating);
    });
  }, [rating]);

  const addRating = (userRating) => {
    const newRating = (rating * totalRating + userRating) / (totalRating + 1);
    const updateDocRef = doc(firestore, `users/${resume.id}/ratings/count`);
    const setDocRef = doc(firestore, `users/${resume.id}/ratings/${user.uid}`);

    getDoc(setDocRef).then((snapshot) => {
      if (!snapshot.exists()) {
        updateDoc(updateDocRef, {
          count: newRating,
          totalRating: totalRating + 1,
        });
        setRating(newRating);

        setDoc(setDocRef, {
          rating: userRating,
        });
      }
    });
  };

  return (
    <div className="flex flex-col items-stretch justify-start gap-4 rounded-xl bg-black/5 p-4 backdrop-blur">
      <ResumeViewer url={resume.resume.url} />
      <div>
        <div className="flex flex-row items-center justify-start gap-4">
          <img
            src={resume.photoURL}
            alt={`profile picture ${resume.displayName}`}
            width={48}
            height={48}
            className="rounded-2xl hover:animate-spin"
          />
          <div className="flex flex-col items-stretch justify-start gap-2">
            <p className="font-bold leading-none">{resume.displayName}</p>
            <p className="font-semibold leading-none">
              {Array.from(Array(Math.round(rating))).map((i) => "⭐")}(
              {totalRating})
            </p>
          </div>
          {alreadyRating && <p>already rated {alreadyRating}</p>}
        </div>

        <div className="flex flex-row items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-red-200/60 via-yellow-200/60 to-green-200/60 px-4 py-2 text-center font-bold backdrop-blur">
          {[1, 2,3,4,5].map(function (ratingValue) { return (<button
          key={ratingValue}
            onClick={() => addRating(ratingValue)}
            className="aspect-square h-8 w-8 rounded-full text-lg font-bold leading-none backdrop-blur hover:bg-white/60"
          >
            {ratingValue}
          </button>)})}
        </div>
      </div>
    </div>
  );
}
