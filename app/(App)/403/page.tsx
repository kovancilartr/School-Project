import Link from "next/link";
import React from "react";

const AccessDenied = () => {

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5 h-screen">
      <div className="max-w-7xl w-full">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-4xl font-bold text-white">
            403 Forbidden
          </h1>
          <p className="text-center text-white">
            You don&apos;t have permission to access this page.
          </p>
          <Link href={"/"}>
            <button className="bg-white text-black rounded-lg px-4 py-2 mt-4">
              Go back
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AccessDenied;
