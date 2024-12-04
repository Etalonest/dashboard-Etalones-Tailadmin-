import { Metadata } from "next";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import ProfileComponent from "@/src/components/Profile/Profile";

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Profile = () => {
  return (
    <DefaultLayout>
     <ProfileComponent />
    </DefaultLayout>
  );
};

export default Profile;
