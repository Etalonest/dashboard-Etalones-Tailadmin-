// import { useState } from "react";
// import Link from "next/link";
// import ClickOutside from "@/src/components/ClickOutside";
// import { signOut } from 'next-auth/react';
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { ChevronDown, LogOut, NotebookTabs, Settings, UserRound } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// const DropdownUser = () => {
//   const router = useRouter();

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const { data: session } = useSession();
// const handleLogout = async () => {
//   await signOut();
//   router.push('/auth/signin');
// };
//   return (
//     <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
//       <Link
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//         className="flex items-center gap-4"
//         href="#"
//       >
//         <span className="hidden text-right lg:block">
//           <span className="block text-sm font-medium text-black dark:text-white">
//             {session?.user?.name ?? "Thomas Anree"}
//           </span>
//           <span className="block text-xs">{session?.managerRole}</span>
//         </span>

//         <span className="h-12 w-12 rounded-full">
// <Image width={100} height={100} alt="User Avatar" src={session?.user?.image ?? "/images/user/user-01.png"} />
//         </span>
//         <ChevronDown />
//       </Link>

//       {/* <!-- Dropdown Start --> */}
//       {dropdownOpen && (
//         <div
//           className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
//         >
//           <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
//             <li>
//               <Link
//                 href="/profile"
//                 className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
//               >
//                 <UserRound />
//                 My Profile
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="#"
//                 className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
//               >
//                 <NotebookTabs />
//                 My Contacts
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/settings"
//                 className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
//               >
//                <Settings />
//                 Account Settings
//               </Link>
//             </li>
//             <li>
//   <button
//     onClick={handleLogout}
//     className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
//   >
// <LogOut />
//     Sign Out
//   </button>
// </li>

//           </ul>
//         </div>
//       )}
//       {/* <!-- Dropdown End --> */}
//     </ClickOutside>
//   );
// };

// export default DropdownUser;
import { useState } from "react";
import Link from "next/link";
import ClickOutside from "@/src/components/ClickOutside";
import { signOut } from 'next-auth/react';
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ChevronDown, LogOut, NotebookTabs, Settings, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCandidates } from "@/src/context/CandidateContext";
const DropdownUser = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/signin');
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      {/* Проверка сессии */}
      {session ? (
        // Если сессия есть, отображаем профиль и кнопку выхода
        <>
          <Link
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-4"
            href="#"
          >
            <span className="hidden text-right lg:block">
              <span className="block text-sm font-medium text-black dark:text-white">
                {session.user?.name ?? "Thomas Anree"}
              </span>
              <span className="block text-xs">{session.managerRole}</span>
            </span>

            <span className="h-12 w-12 rounded-full">
              <Image width={100} height={100} alt="User Avatar" src={session.user?.image ?? "/images/user/user-01.png"} />
            </span>
            <ChevronDown />
          </Link>

          {/* <!-- Dropdown Start --> */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                <li>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    <UserRound />
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    <NotebookTabs />
                    My Contacts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    <Settings />
                    Account Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    <LogOut />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
          {/* <!-- Dropdown End --> */}
        </>
      ) : (
        // Если сессия отсутствует, показываем кнопку для входа
        <Link href="/auth/signin" className="flex items-center gap-4">
          <span className="text-sm font-medium text-black dark:text-white">Sign In</span>
        </Link>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
