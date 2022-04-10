import { createContext, useContext, useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

import { authentication, firestore } from "..";

const initialContextValues = {
  user: undefined,
  data: undefined,
  isFetching: true,
};

export const AuthContext = createContext(initialContextValues);

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(initialContextValues.user);
  const [data, setData] = useState(initialContextValues.data);
  const [isFetching, setIsFetching] = useState(initialContextValues.isFetching);

  useEffect(function () {
    console.log("Auth observer attached.");

    return onAuthStateChanged(
      authentication,
      setUser,
      function (error) {
        console.error("Auth observer failed!", error);
      },
      function () {
        console.log("Auth observer removed.");
      }
    );
  }, []);

  useEffect(
    function () {
      let unsubscribe = function () {};

      if (user) {
        console.log("Data observer attached.");

        const dataDocRef = doc(firestore, "users", user.uid);
        const collectionDocRef = doc(
          firestore,
          `users/${user.uid}/ratings/count`
        );

        unsubscribe = onSnapshot(
          dataDocRef,
          function (dataSnap) {
            if (dataSnap.exists()) {
              const dataSnapData = dataSnap.data();
              if (
                !["displayName", "photoURL"]
                  .map(function (dataProp) {
                    return user[dataProp] === dataSnapData[dataProp];
                  })
                  .includes(false)
              ) {
                setData(dataSnapData);
              } else {
                setDoc(dataDocRef, {
                  ...dataSnapData,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                });
              }
            } else {
              setDoc(dataDocRef, {
                displayName: user.displayName,
                photoURL: user.photoURL,
                resume: {
                  url: null,
                  updatedAt: null,
                },
              });
            }
          },
          function (error) {
            console.error("Data observer failed!", error);
          },
          function () {
            console.log("Data observer removed.");
          }
        );
      } else {
        setData(null);
      }

      return unsubscribe;
    },
    [user]
  );

  useEffect(
    function () {
      setIsFetching(
        user === initialContextValues.user || data === initialContextValues.data
      );
    },
    [user, data]
  );

  return (
    <AuthContext.Provider
      value={{
        ...initialContextValues,
        user,
        data,
        isFetching,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function signInWithGoogle() {
  const GoogleProvider = new GoogleAuthProvider();

  signInWithRedirect(authentication, GoogleProvider);
}

export function logout() {
  signOut(authentication);
}

export function AuthSwitch({
  whileFetching = null,
  whenIsNotUser = null,
  whenIsUser = null,
}) {
  const { user, isFetching } = useAuth();

  if (isFetching) {
    return whileFetching;
  }

  if (!user) {
    return whenIsNotUser;
  }

  if (user) {
    return whenIsUser;
  }

  return null;
}
