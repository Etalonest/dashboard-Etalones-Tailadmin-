
import { auth } from "@/auth";
import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import ProfileComponent from "@/src/components/Profile/Profile";
import { redirect } from 'next/navigation';

const Profile = async () => {
  const session = await auth();  

  if (!session) {
    redirect('/auth/signin');  
  }

  return (
    <DefaultLayout>
      <ProfileComponent />
    </DefaultLayout>
  );
};

export default Profile;
