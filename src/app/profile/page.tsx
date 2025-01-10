
import { auth } from "@/auth";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import ProfileComponent from "@/src/components/Profile/Profile";
import { ManagersProvider } from "@/src/context/ManagersContext";
import { redirect } from 'next/navigation';
import { useManagers } from '@/src/context/ManagersContext';

const Profile = async () => {
  const session = await auth();  

  if (!session) {
    redirect('/auth/signin');  
  }

  return (
    <DefaultLayout>
      <ManagersProvider>
      <ProfileComponent />
      </ManagersProvider>
    </DefaultLayout>
  );
};

export default Profile;
