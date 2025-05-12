import UserProfile from './PerfilUsuario';

interface Props {
  children: React.ReactNode;
}

const UserLayout = ({ children }: Props) => {
  return (
    <div className="max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8 py-10 px-4">

    
      <aside className="">
        <UserProfile />
      </aside>

     
      <main className="md:col-span-3">
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
