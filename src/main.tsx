import React from 'react'
import "./main.css"
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AppShell,  MantineProvider} from '@mantine/core'
import TitleBar from './Components/TitleBar.tsx'
import MenuBar from './Components/MenuBar.tsx'
import Sidebar from './Components/SideBar.tsx'
import { NavProvider } from './context/AuthContext.tsx'
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ToastContainer />
     <NavProvider>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          colors: {
            // Add your color
            deepBlue: ['#E9EDFC', '#C1CCF6', '#99ABF0' /* ... */],
            // or replace default theme color
            blue: ['#E9EDFC', '#C1CCF6', '#99ABF0' /* ... */],
          },
          
          
        }}
      >
        <MenuBar />
     
        <AppShell mt={24} padding={'md'} navbarOffsetBreakpoint={"sm"}
              navbar={<Sidebar />}
              header={<TitleBar />}
          >


          <App />
        </AppShell>
      </MantineProvider>
     </NavProvider>
  </React.StrictMode>,
)
