import React from "react";

type Props = {};

export default function Hazard({}: Props) {
  return (
    <div className="fixed top-1/2 left-1/2 w-1/2 h-1/4 bg-red-600 bg-opacity-75 flex justify-center items-center transform -translate-x-1/2 -translate-y-1/2 z-50">
      <p className="text-white text-3xl">Hazard</p>
    </div>
  );
}
