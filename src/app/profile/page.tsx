
import { auth } from "@/auth";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import ProfileComponent from "@/src/components/Profile/Profile";
import { AllCandidatesProvider } from "@/src/context/AllCandidatesContext";
import { ManagersProvider } from "@/src/context/ManagersContext";
import { redirect } from 'next/navigation';

const Profile = async () => {
  const session = await auth();  

  if (!session) {
    redirect('/auth/signin');  
  }

  return (
    <>
      <ManagersProvider>
        <AllCandidatesProvider>
      <ProfileComponent />
      </AllCandidatesProvider>
      </ManagersProvider>
    </>
  );
};

export default Profile;
