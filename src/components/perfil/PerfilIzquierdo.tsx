
import UserProfileCard from "@components/perfil/UserProfileCard";
interface Props {
  children: React.ReactNode;
}

const UserLayout = ({ children }: Props) => {
  return (
    <div className="">


        <UserProfileCard />


     
      <main className="md:col-span-3">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
