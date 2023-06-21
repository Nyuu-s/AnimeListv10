import { createContext, useContext, useState } from "react";


type AuthContextType = {
    user: boolean;
    login: () => void;
    logout: () => void;
  };

  type NavState = {
    opened: boolean;
    toggle: () => void,
    open: () => void,
    close: () => void, 
  }

  type TableSettings = {
    vSpacing: string | undefined,
    fontSize: string| undefined,
    itemsPerPages: number | '',
    isSticky: boolean,
    changeVSpacing(str: string | undefined): void
    changefontSize(str: string | undefined): void
    changeItemsPP(nb: number | ''): void
    changeStickness(value?: boolean): void
  }

type AppContextType = {
    navState: NavState
    tableSettings: TableSettings
}





const AuthContext = createContext<AuthContextType>({
  user: false,
  login: () => {},
  logout: () => {},
});

const AppContext = createContext<AppContextType>({
    navState: {
      opened: false,
    
      toggle: () => {},
      open: () => {},
      close: () => {},
    },
    tableSettings: {
      vSpacing: "",
      fontSize: "",
      itemsPerPages: '',
      isSticky: false,
      changeStickness: () => {},
      changeVSpacing: () => {},
      changefontSize: () => {},
      changeItemsPP: () => {}
    }
    
    
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

export function AppProvider({children}: {children: React.ReactNode})
{
  const [vSpacing, setVSpacing] = useState<string | undefined>("");
  const [fontSize, setfontSize] = useState<string | undefined>("");
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [itemsPerPages, setItemsPerPages] = useState<number | ''>(10);
  const changefontSize = (value: string | undefined) => setfontSize(value);
  const changeItemsPP = (value: number | '') => {
    setItemsPerPages(value)
    console.log(value);
    
  };
  const changeVSpacing = (value: string | undefined) => setVSpacing(value);
  const changeStickness = (value?: boolean ) => {
    if(value !== undefined)
    {
      setIsSticky(value);
    }
    else
    {
      setIsSticky(() => (!isSticky));
    }
  }
  
  const [opened, setOpened] = useState<boolean>(false);
  const toggle =  () => {
    console.log("dsgsg", opened);
    setOpened(() => !opened)
  }
  const open = () => {setOpened(true)}
  const close =  () => {setOpened(false)}

  const tableSettings = {
    vSpacing,
    fontSize,
    itemsPerPages,
    isSticky,
    changeStickness,
    changeItemsPP,
    changeVSpacing,
    changefontSize
  }

  const navState = {
    opened,
    toggle,
    open,
    close
  }
    

    return (
        <AppContext.Provider value={{ navState, tableSettings }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppState() 
{
    return useContext(AppContext);
}

