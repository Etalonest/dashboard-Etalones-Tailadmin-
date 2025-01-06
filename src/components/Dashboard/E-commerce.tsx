"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import Stats from "@/src/components/stats/Stats";
import { useManager } from "@/src/context/ManagerContext";
import TableCandidate from "../Tables/TableCandidaate";
import { Eye } from "lucide-react";
import ChartCandAdded from "../Charts/ChartCandAdded";
const MapOne = dynamic(() => import("@/src/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/src/components/Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  const { manager } = useManager();

  return (
    <>
    
<Stats/>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartCandAdded />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableCandidate   />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
