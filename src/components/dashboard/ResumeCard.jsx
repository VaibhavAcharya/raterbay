import { useEffect, useState, useRef } from "react";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { firestore } from "../../db";
import { useAuth } from "../../db/helpers/auth";

import ResumeViewer from "../common/ResumeViewer";

export default function ResumeCard({ user: resume }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(resume.resume.rating.total);
  const [comments, setComments] = useState(null);
  const [totalRating, setTotalRating] = useState(resume.resume.rating.times);
  const [alreadyRating, setAlreadyRating] = useState(false);
  const commentRef = useRef(null);

  // fetch rating and check if current user already rated this resume
  useEffect(() => {
    const alreadyRatingRef = doc(
      firestore,
      `users/${resume.id}/ratings/${user.uid}`
    );
    getDoc(alreadyRatingRef).then((snapshot) => {
      setAlreadyRating(snapshot.data().rating);
    });
  }, [rating]);

  // fetching comments
  useEffect(() => {
    const comeentRef = collection(firestore, `users/${resume.id}/comments/`);
    getDocs(comeentRef).then((snapshot) => {
      setComments(
        snapshot.docs.map(function (commentDoc) {
          return {
            userId: commentDoc.data().userId,
            comment: commentDoc.data().comment,
          };
        })
      );
    });
  }, [comments]);

  const addRating = (userRating) => {
    const newRating = (rating * totalRating + userRating) / (totalRating + 1);
    const updateDocRef = doc(firestore, `users/${resume.id}`);
    const setDocRef = doc(firestore, `users/${resume.id}/ratings/${user.uid}`);

    getDoc(setDocRef).then((snapshot) => {
      if (!snapshot.exists()) {
        updateDoc(updateDocRef, {
          resume: {
            ...resume.resume,
            rating: {
              total: newRating,
              times: increment(1),
            },
          },
        });
        setRating(newRating);

        setDoc(setDocRef, {
          rating: userRating,
        });
      }
    });
  };

  const addComment = () => {
    if (commentRef.current.value !== "") {
      const setDocRef = collection(firestore, `users/${resume.id}/comments`);
      addDoc(setDocRef, {
        userId: user.uid,
        comment: commentRef.current.value,
      });

      setComments([]);
    }
  };

  return (
    <div className="mb-6 flex flex-col items-stretch justify-start gap-4 rounded-xl bg-black/5 p-4 backdrop-blur">
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
          {[1, 2, 3, 4, 5].map(function (ratingValue) {
            return (
              <button
                key={ratingValue}
                onClick={() => addRating(ratingValue)}
                className="aspect-square h-8 w-8 rounded-full text-lg font-bold leading-none backdrop-blur hover:bg-white/60"
              >
                {ratingValue}
              </button>
            );
          })}
        </div>
        <div>
          <div>
            <p>Comments here</p>
            <input ref={commentRef} type="text" />
            <button onClick={addComment} className="ml-3">
              Submit
            </button>
          </div>
          <div>
            <p className="text-xl font-medium">Comments</p>
            {comments &&
              comments.map((comment) => (
                <>
                  <p>{comment.userId}</p>
                  <p>{comment.comment}</p>
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
