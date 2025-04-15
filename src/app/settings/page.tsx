import Breadcrumb from "@/src/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import Setting from "@/src/components/Setting/Seetting";

export const metadata: Metadata = {
  title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Settings = () => {
  return (
    <>
      <Setting/>
    </>
  );
};

export default Settings;
