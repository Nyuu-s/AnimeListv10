import { createContext, useContext, useState } from "react";


type AuthContextType = {
    user: boolean;
    login: () => void;
    logout: () => void;
  };

type NavContextType = {
    opened: boolean;
    toggle: () => void,
    open: () => void,
    close: () => void,
    
    
}


const AuthContext = createContext<AuthContextType>({
  user: false,
  login: () => {},
  logout: () => {},
});

const NavContext = createContext<NavContextType>({
    opened: false,
    
    toggle: () => {},
    open: () => {},
    close: () => {},
    
  });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<boolean>(false);

  const login = () => {
    console.log("hsdbhg");
    
    setUser(true);
  };

  const logout = () => {
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function NavProvider({children}: {children: React.ReactNode})
{
    const [opened, setOpened] = useState<boolean>(false);

    
        const toggle =  () => {
            console.log("dsgsg", opened);
            setOpened(() => !opened)
        }
        const open = () => {setOpened(true)}
        const close =  () => {setOpened(false)}
    

    return (
        <NavContext.Provider value={{ opened, toggle, close, open}}>
            {children}
        </NavContext.Provider>
    )
}

export function useNavState() 
{
    return useContext(NavContext);
}
