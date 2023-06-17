import React from 'react'
import "./main.css"
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AppShell,  MantineProvider} from '@mantine/core'
import TitleBar from './Components/TitleBar.tsx'
import MenuBar from './Components/MenuBar.tsx'
import Sidebar from './Components/SideBar.tsx'
import {NavProvider as AppProvider, DataProvider } from './context'
import { ToastContainer } from 'react-toastify';
import {MemoryRouter} from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MemoryRouter>
     

 
 
      <ToastContainer />
      <AppProvider>

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
          <DataProvider>
            <MenuBar />
        
            <AppShell mt={24} padding={'md'}  navbarOffsetBreakpoint={"sm"}
                  navbar={<Sidebar />}
                  header={<TitleBar />}
            
              >

                <App />
              
            </AppShell>
          </DataProvider>
        </MantineProvider>
      </AppProvider>
    </MemoryRouter>
  </React.StrictMode>,
)
