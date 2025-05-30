import { createContext } from 'react';

export const ChatsContext = createContext<any>(null);

export const ChatsProvider = ({ children }: { children: React.ReactNode }) => {

  return (
    <ChatsContext.Provider
      value={{}}
    >
      {children}
    </ChatsContext.Provider>
  );
};
