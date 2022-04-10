import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "../../db";

export default function CommentCard({ comment }) {
  const [userData, setUserData] = useState(null);

  const userDataRef = doc(firestore, `users/${comment.userId}`);

  useEffect(() => {
    getDoc(userDataRef).then((snapshot) => {
      setUserData(snapshot.data());
      console.log(snapshot.data());
    });
  }, []);

  return (
    <div className="flex flex-row items-start justify-start gap-4">
      <img
        src={userData?.photoURL}
        alt={`profile picture ${userData?.displayName}`}
        width={32}
        height={32}
        className="rounded-lg hover:animate-spin"
      />
      <div>
        <p className="font-bold">{userData?.displayName}</p>
        <p>{comment.comment}</p>
      </div>
    </div>
  );
}
