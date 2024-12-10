"use client";
import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import ChartOne from "@/src/components/Charts/ChartOne";
import ChartTwo from "@/src/components/Charts/ChartTwo";
import dynamic from "next/dynamic";
import React from "react";

const ChartThree = dynamic(() => import("@/src/components/Charts/ChartThree"), {
  ssr: false,
});

const Chart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default Chart;
