"use client";
import dynamic from "next/dynamic";
import React from "react";
import TableCandidate from "../Tables/TableCandidate";
import ChartCandAdded from "../Charts/ChartCandAdded";
const MapOne = dynamic(() => import("@/src/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/src/components/Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {

  return (
    <>
    
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartCandAdded />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableCandidate   />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
