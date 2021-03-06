import { useEffect, useState, useRef } from "react";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { firestore } from "../../db";
import { useAuth } from "../../db/helpers/auth";

import ResumeViewer from "../common/ResumeViewer";
import CommentCard from "./CommentCard";

export default function ResumeCard({ user: resume }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(resume.resume.rating.total);
  const [comments, setComments] = useState(null);
  const [totalRating, setTotalRating] = useState(resume.resume.rating.times);
  const [alreadyRating, setAlreadyRating] = useState(false);
  const commentRef = useRef(null);

  // fetch rating and check if current user already rated this resume
  useEffect(() => {
    if (resume.resume?.url) {
      const collectionPath = resume.resume.url.split("/").join(".");
      const alreadyRatingRef = doc(
        firestore,
        `users/${resume.id}/ratings/${collectionPath}/ratings/${user.uid}`
      );
      getDoc(alreadyRatingRef).then((snapshot) => {
        if (snapshot.exists()) {
          setAlreadyRating(snapshot.data().rating);
        }
      });
    }
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
    const updateDocRef = doc(firestore, `users/${resume.id}`);
    const collectionPath = resume.resume.url.split("/").join(".");
    const setDocRef = doc(
      firestore,
      `users/${resume.id}/ratings/${collectionPath}/ratings/${user.uid}`
    );
    const checkDocRef = doc(firestore, `users/${resume.id}`);

    getDoc(checkDocRef).then((snapshot) => {
      const oldRatedTimes = snapshot.data().resume?.rating?.times || 0;
      const oldRatedTotal = snapshot.data().resume?.rating?.total || 0;
      const newRating =
        (oldRatedTotal * oldRatedTimes + userRating) / (oldRatedTimes + 1);

      updateDoc(updateDocRef, {
        resume: {
          ...resume.resume,
          rating: {
            total: newRating,
            times: oldRatedTimes + 1,
          },
        },
      });
      setRating(Number(newRating));
      setTotalRating(oldRatedTimes + 1);

      setDoc(setDocRef, {
        rating: userRating,
      });
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
      commentRef.current.value = "";
    }
  };

  return (
    <div className="mb-6 flex flex-col items-stretch justify-start gap-4 rounded-xl bg-black/5 p-4 backdrop-blur">
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
            {Array.from(Array(Math.round(rating))).map((i) => "???")}(
            {totalRating})
          </p>
        </div>
      </div>
      <div className="flex max-w-min flex-row items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-red-200/60 via-yellow-200/60 to-green-200/60 px-4 py-2 text-center font-bold backdrop-blur">
        {[1, 2, 3, 4, 5].map(function (ratingValue) {
          return (
            <button
              key={ratingValue}
              onClick={alreadyRating ? () => {} : () => addRating(ratingValue)}
              className={[
                "aspect-square h-8 w-8 rounded-full text-lg font-bold leading-none backdrop-blur",
                alreadyRating
                  ? alreadyRating === ratingValue
                    ? "bg-black/20"
                    : ""
                  : "bg-white/20 hover:bg-white/60",
              ].join(" ")}
            >
              {ratingValue}
            </button>
          );
        })}
      </div>
      <ResumeViewer url={resume.resume.url} />
      <div className="flex flex-col items-stretch justify-start gap-4">
        <p className="text-lg font-bold">Comments</p>
        <div className="flex flex-col items-stretch justify-start gap-2">
          {comments?.map((comment) => (
            <CommentCard comment={comment} />
          ))}
        </div>
        <div className="flex flex-row items-stretch justify-between gap-4">
          <input
            ref={commentRef}
            type="text"
            className="w-full rounded-2xl bg-teal-50 px-4 py-2 backdrop-blur"
            maxLength={200}
          />
          <button
            onClick={addComment}
            className="rounded-2xl bg-teal-300 px-4 py-2 font-bold"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
