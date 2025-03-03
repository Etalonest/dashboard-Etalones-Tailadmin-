import DefaultLayout from "@/src/components/Layouts/DefaultLayout";
import FileManager from "@/src/lib/firebase/FileManager";

export default function Page() {
  return (
   <DefaultLayout>
    <FileManager />
   </DefaultLayout>
  );
}