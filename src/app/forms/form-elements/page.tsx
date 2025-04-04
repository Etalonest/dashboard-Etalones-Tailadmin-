import React from "react";
import FormElements from "@/src/components/FormElements";
import { Metadata } from "next";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const FormElementsPage = () => {
  return (
    <>
      <FormElements />
    </>
  );
};

export default FormElementsPage;
