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
import { useSession } from "@/src/context/SessionContext";
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
  const [isLoading, setIsLoading] = useState(true);

  const { session } = useSession();


  useEffect(() => {
    if (session?.managerRole === 'admin') {
      const fetchData = async () => {
        try {
          const rolesResponse = await fetch("/api/role");
          if (!rolesResponse.ok) {
            throw new Error("Ошибка при загрузке ролей");
          }
          const rolesData = await rolesResponse.json();
          setRoles(rolesData);

          const usersResponse = await fetch("/api/user");
          if (!usersResponse.ok) {
            throw new Error("Ошибка при загрузке пользователей");
          }
          const usersData = await usersResponse.json();
          setUsers(usersData);
        } catch (error: any) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [session?.managerRole]);
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
  if (isLoading) {
    return <div>Loading...</div>; // Пока загружаем, показываем индикатор загрузки
  }
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
}
