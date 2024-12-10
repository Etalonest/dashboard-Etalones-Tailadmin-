import { signOut } from "@/auth"
 
// export function SignOut() {
//   return (
//     <form
//       action={async () => {
//         "use server"
//         await signOut()
//       }}
//     >
//       <button type="submit">Sign Out</button>
//     </form>
//   )
// }
export function SignOut() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault(); // Чтобы предотвратить перезагрузку страницы
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
