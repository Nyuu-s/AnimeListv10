
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Custom404 from './Pages/404'
import Records from './Pages/Records'
import Home from './Pages/Home'

import { invoke } from '@tauri-apps/api'
import { toast } from 'react-toastify'
import Details from './Pages/Details'
import { useDataState } from './context'
import { useAppState } from './context/AppContext'
import { ChartData, SimpleTableData } from './Components/Helpers/useCustomTypes'


type UProperties = {
  is_auto_window_save: boolean
}


function App() {

const {userPreferences} = useAppState()

const {setBothDataAndHeaders, setSimpleStatTablesData, setChartsCollection} = useDataState()



useEffect(() => {
    const fetchData = async () => {
      
      try {
        const data: object = await invoke("get_data", {});
        setBothDataAndHeaders(data)
      } catch (error) {
        console.log("Something went wrong with the fetch of main list data");
        
      }
        //set data + headers object in context
      try {
        const stats = await invoke('fetch_stats_data', {}) as SimpleTableData[]
        setSimpleStatTablesData(stats)
      } catch (error) {
        console.log("Something went wrong with the fetch of statistic tables data");
      }

      try {
        const charts = await invoke('fetch_charts_data', {}) as ChartData[]
        setChartsCollection(charts)
      } catch (error) {
        console.log("Something went wrong with the fetch of statistic charts data", error);
      }
    }

    fetchData();
  

}, [])



useEffect(() => {
  const readUserCfg = async () => {
    try {
      let userCfg: UProperties = await invoke("read_user_config", {});
      userPreferences.changeIsAutoWindowCfgSave(userCfg.is_auto_window_save)
    } catch (error) {
      toast.warn("Invalid user config", {toastId: "warn:usercfg", progress: "false"})
    }
  }
  readUserCfg()

}, [])



// useEffect(() => {
//   let resizetimeout: any;

//   let movetimeout: any;
//   const resize = async () => {
//     const pos = await appWindow.outerPosition();
//     const isMaxed = await appWindow.isFullscreen();

//     const unlisten = await appWindow.onResized(({ payload: size }) => {
//       clearTimeout(resizetimeout)
//       resizetimeout = setTimeout(() => {
//           isMaxed ? invoke("save_window_config", {posx: 0, posy: 0, sizex: 0, sizey: 0, useDefault: true, active: userSettings.isAutoWindowCfgSave})
//           :
//           invoke("save_window_config", {posx: pos.x, posy: pos.y, sizex: size.width, sizey: size.height, useDefault: false, active: userSettings.isAutoWindowCfgSave})
          
        
//       }, 1000);
//     });
//     return unlisten;
//   };

//   const move = async () => {
//     let size = await appWindow.innerSize();
//     const isMaxed = await appWindow.isFullscreen();
    
//     const unlisten = await appWindow.onMoved(({ payload: position }) => {
//       clearTimeout(movetimeout)
//       movetimeout = setTimeout(() => {
//           isMaxed ? invoke("save_window_config", {posx: 0, posy: 0, sizex: 0, sizey: 0, useDefault: true, active: userSettings.isAutoWindowCfgSave})
//           :
//           invoke("save_window_config", {posx: position.x, posy: position.y, sizex: size.width, sizey: size.height, useDefault:false, active: userSettings.isAutoWindowCfgSave})
//       }, 1000);
//     });
//     return unlisten;
//   }; 

  
//     (async () => {
      
//       const unListenResize = await resize(); 
//       const unListenMove = await move(); 

//       // Return the cleanup function directly
//       return () => {
        
//         unListenResize();
//         unListenMove();
//       };
//     })();
// }, [userSettings.isAutoWindowCfgSave])

  
  return (
    <> 
      <Routes> 
        <Route path='/' element={<Home />}/>
        <Route path='/list' element={<Records />}/>
        <Route path='/details/:id' element={<Details />}/>
        <Route path="*" element={<Custom404 />} />
      </Routes>

    </>
  )
}

export default App