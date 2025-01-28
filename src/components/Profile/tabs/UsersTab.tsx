// 'use client'
// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
//   } from "@/components/ui/table"
//   import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectLabel,
//     SelectTrigger,
//     SelectValue,
//   } from "@/components/ui/select"
//  import { useSession } from "next-auth/react";
// import { useManagers } from "@/src/context/ManagersContext";
// import Link from "next/link";
// import { use, useEffect, useState } from "react";


  

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: Role;
// }
// interface Role {
//   _id: string;
//   name: string;
//   nameRu: string;
// }
//   export function UsersTab() { 
//     const [users, setUsers] = useState<User[]>([]);
//     const [roles, setRoles] = useState<Role[]>([]);
//     const { data: session } = useSession();
// if (session?.managerRole === 'admin') {

//   const { managers } = useManagers();

//   useEffect(() => { 
//     const fetchRoles = async () => {
//       try {
//         const response = await fetch("/api/role");
//         if (!response.ok) {
//           throw new Error("Ошибка при загрузке ролей");
//         }
//         const data = await response.json();
//         setRoles(data);
//       } catch (error: any) {
// console.log(error);
//       } 
//     };
//     fetchRoles();
//   }, []);
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch("/api/user"); 
//         if (!response.ok) {
//           throw new Error("Ошибка при загрузке пользователей");
//         }
//         const data = await response.json();
//         setUsers(data);
//       } catch (error: any) {
// console.log(error);
//       } 
//     };
//     fetchUsers();
//   }, []);
  
//     return (
//         <>
//         <span className="font-bold text-md">Пользлватели EtalonesAdmin</span>
       
//       <Table>
//         <TableCaption className="font-bold text-center ">
        
                      
//           </TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Имя</TableHead>
//             <TableHead className="text-center">Почта</TableHead>
//             <TableHead className="text-center"></TableHead>
//             <TableHead className="text-center">Статус</TableHead>
//             <TableHead className="text-center">Роль</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {users.map((user: any) => (
//             <TableRow key={user.name} >
//               <TableCell className="text-start">{user.name}</TableCell>
//               <TableCell className="text-center">
//               {user.email}
//               </TableCell>
//               <TableCell className="text-center">
//               {user?.role?.nameru}
//               </TableCell>
//               <TableCell className="text-center">
//                 <div className="flex justify-center">
//                 В работе с &nbsp;<Link href={'#'} className="underline">партнёром</Link>
//                 </div>
//                 </TableCell>
//               <TableCell className="text-right">
//                 <Select>
//               <SelectTrigger >
//         <SelectValue placeholder='Без роли' />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectLabel>Роли</SelectLabel>
//           <SelectItem value="no-role" className="cursor-pointer hover:bg-gray-200 ">Без роли</SelectItem>
// {roles.map((role: any) => (
// <SelectItem key={role._id} value={role.name} className="cursor-pointer hover:bg-gray-200 ">
// {role.nameRu}
// </SelectItem>
// ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
               
//                 </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
        
//       </Table>
//       </>
//     )
//   }
// }
'use client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "next-auth/react";
import { useManagers } from "@/src/context/ManagersContext";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

interface Role {
  _id: string;
  name: string;
  nameRu: string;
}

export function UsersTab() { 
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const { data: session } = useSession();

  if (session?.managerRole === 'admin') {


  // Функция для загрузки ролей
  useEffect(() => { 
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/role");
        if (!response.ok) {
          throw new Error("Ошибка при загрузке ролей");
        }
        const data = await response.json();
        setRoles(data);
      } catch (error: any) {
        console.log(error);
      } 
    };
    fetchRoles();
  }, []);

  // Функция для загрузки пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user"); 
        if (!response.ok) {
          throw new Error("Ошибка при загрузке пользователей");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error: any) {
        console.log(error);
      } 
    };
    fetchUsers();
  }, []);

  // Хэндлер для изменения роли пользователя
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const formData = new FormData();
      formData.append('role', newRole);

      const response = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка при изменении роли");
      }

      // Обновляем данные пользователей с новой ролью
      setUsers((prevUsers) => 
        prevUsers.map((user) => 
          user._id === userId ? { ...user, role: { ...user.role, name: newRole } } : user
        )
      );
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <>
      <span className="font-bold text-md">Пользователи EtalonesAdmin</span>
     
      <Table>
        <TableCaption className="font-bold text-center">
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Имя</TableHead>
            <TableHead className="text-center">Почта</TableHead>
            <TableHead className="text-center"></TableHead>
            <TableHead className="text-center">Статус</TableHead>
            <TableHead className="text-center">Роль</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="text-start">{user.name}</TableCell>
              <TableCell className="text-center">{user.email}</TableCell>
              <TableCell className="text-center">{user.role?.nameRu}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  В работе с &nbsp;<Link href={'#'} className="underline">партнёром</Link>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Select
                  value={user.role?.name}
                  onValueChange={(newRole) => handleRoleChange(user._id, newRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Без роли' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Роли</SelectLabel>
                      <SelectItem value="no-role" className="cursor-pointer hover:bg-gray-200 ">
                        Без роли
                      </SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role._id} value={role._id} className="cursor-pointer hover:bg-gray-200 ">
                          {role.nameRu}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}}
