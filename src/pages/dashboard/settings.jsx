import { useRef, useState } from "react";

import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { firestore, storage } from "../../db";
import { logout, useAuth } from "../../db/helpers/auth";

import ResumeViewer from "../../components/common/ResumeViewer";

export default function Settings() {
  const { user, data } = useAuth();

  const $fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isResumeRemoving, setIsResumeRemoving] = useState(false);

  function selectFile() {
    $fileRef.current?.click();
  }

  function uploadFile() {
    console.log("Resume upload started.");

    setIsFileUploading(true);

    const fileUploadTask = uploadBytes(
      ref(storage, `${user.uid}/${new Date().toISOString()}.pdf`),
      selectedFile
    )
      .then(function (uploadRes) {
        console.log("Resume upload successful.", uploadRes);
        console.log("New resume URL fetch started.");

        getDownloadURL(uploadRes.ref)
          .then(function (newResumeURL) {
            console.log("New resume URL fetched successfully.", newResumeURL);
            console.log("Resume data update started.");

            setDoc(doc(firestore, "users", user.uid), {
              ...data,
              resume: {
                url: newResumeURL,
                updatedAt: uploadRes.metadata.updated,
                rating: {
                  total: 0,
                  times: 0,
                },
              },
            })
              .then(function () {
                console.log("Resume data updated successfully.");

                // Clear selected file.
                setSelectedFile(null);
                $fileRef.current.value = "";
              })
              .catch(function (error) {
                console.error("Resume data updated failed!", error);
              })
              .finally(function () {
                setIsFileUploading(false);
              });
          })
          .catch(function (error) {
            console.error("New resume URL fetched failed!", error);
            setIsFileUploading(false);
          });
      })
      .catch(function (error) {
        console.error("Resume upload failed!", error);
        setIsFileUploading(false);
      });
  }

  function removeResume() {
    console.log("Resume removal started.");

    setIsResumeRemoving(true);

    setDoc(doc(firestore, "users", user.uid), {
      ...data,
      resume: {
        url: null,
        updatedAt: null,
      },
    })
      .then(function () {
        console.log("Resume removed successfully.");
      })
      .catch(function (error) {
        console.error("Resume removal failed!", error);
      })
      .finally(function () {
        setIsResumeRemoving(false);
      });
  }

  return (
    <main className="flex flex-col items-stretch justify-start divide-y divide-dashed divide-black">
      <div className="flex flex-col items-stretch justify-start gap-6 pb-8">
        <h2 className="text-2xl font-bold">Resume</h2>
        <div>
          {data.resume.url ? (
            <div className="flex flex-col items-stretch justify-start gap-4">
              <div className="flex flex-row items-center justify-end">
                <button
                  onClick={removeResume}
                  className="rounded-2xl bg-teal-300 px-4 py-2 font-bold leading-none disabled:animate-ping disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isResumeRemoving}
                >
                  {isResumeRemoving ? "Removing..." : "Remove"}
                </button>
              </div>
              <ResumeViewer url={data.resume.url} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <input
                ref={$fileRef}
                type="file"
                accept="application/pdf"
                hidden
                onChange={function ({ target }) {
                  setSelectedFile(target.files?.[0] ?? null);
                }}
              />
              <button
                onClick={selectedFile ? uploadFile : selectFile}
                className="animate-bounce rounded-2xl bg-teal-300 px-6 py-3 text-xl font-bold leading-none disabled:animate-ping disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isFileUploading}
              >
                {isFileUploading
                  ? "Uploading..."
                  : selectedFile
                  ? "Confirm"
                  : "Upload"}
              </button>

              {selectedFile ? (
                <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                  <button
                    className="text-sm font-bold text-teal-600"
                    onClick={selectFile}
                  >
                    Change
                  </button>
                  <p className="max-w-[60vw] overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm">
                    {selectedFile.name}
                  </p>
                </div>
              ) : (
                <p className="max-w-xs text-center text-xs">
                  Make sure that there are no personal details in it which you
                  do not want publicly released.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-stretch justify-start gap-6 pt-8">
        <h2 className="text-2xl font-bold">Account</h2>
        <div>
          <div className="flex flex-row items-center justify-start gap-4">
            <button
              className="rounded-2xl bg-red-600 px-4 py-2 font-bold leading-none text-white"
              onClick={logout}
            >
              Logout
            </button>
            <button className="font-bold text-red-600">Delete Account</button>
          </div>
        </div>
      </div>
    </main>
  );
}
