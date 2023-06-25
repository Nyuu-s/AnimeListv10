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

  type UserSetting= {
    isAutoWindowCfgSave: boolean | undefined,
    changeIsAutoWindowCfgSave(value?: boolean): void
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
    userSettings: UserSetting
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
    },
    userSettings: {
      isAutoWindowCfgSave: false,
      changeIsAutoWindowCfgSave: () => {},
    }
    
    
  });



// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<boolean>(false);

//   const login = () => {
   
    
//     setUser(true);
//   };

//   const logout = () => {
//     setUser(false);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

export function AppProvider({children}: {children: React.ReactNode})
{
  const [vSpacing, setVSpacing] = useState<string | undefined>("");
  const [fontSize, setfontSize] = useState<string | undefined>("");
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [itemsPerPages, setItemsPerPages] = useState<number | ''>(10);
  const changefontSize = (value: string | undefined) => setfontSize(value);
  const changeItemsPP = (value: number | '') => {
    setItemsPerPages(value)
  };
  const changeVSpacing = (value: string | undefined) => setVSpacing(value);
  const changeStickness = (value?: boolean ) => {
    value !== undefined ?  setIsSticky(value) : setIsSticky(() => (!isSticky));
  }
  
  const [opened, setOpened] = useState<boolean>(false);
  const toggle =  () => {
    
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
  
  const [isAutoWindowCfgSave, setIsAutoWindowCfgSave] = useState<boolean >(false);
  const changeIsAutoWindowCfgSave = (value: boolean | undefined) => {
    value !== undefined ? setIsAutoWindowCfgSave(value) : setIsAutoWindowCfgSave(() => (!isAutoWindowCfgSave));
  }
  const userSettings = {
    isAutoWindowCfgSave,
    changeIsAutoWindowCfgSave
  }

    return (
        <AppContext.Provider value={{ navState, tableSettings, userSettings }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppState() 
{
    return useContext(AppContext);
}

 