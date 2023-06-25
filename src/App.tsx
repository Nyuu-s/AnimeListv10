
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Animes from './Pages/Animes'
import Custom404 from './Pages/404'
import { useEffect } from 'react'
import { appWindow} from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api'
import { useAppState } from './context/AppContext'
import { toast } from 'react-toastify'

type UProperties = {
  is_auto_window_save: boolean
}


function App() {

const {userSettings} = useAppState()

useEffect(() => {
  const readUserCfg = async () => {
    
    try {
      let userCfg: UProperties = await invoke("read_user_config", {});
      userSettings.changeIsAutoWindowCfgSave(userCfg.is_auto_window_save)
      
    } catch (error) {
      toast.warn("Invalid user config", {toastId: "warn:usercfg", progress: "false"})
    }
  }
  readUserCfg()

}, [])



useEffect(() => {
  let resizetimeout: any;

  let movetimeout: any;
  const resize = async () => {
    const pos = await appWindow.outerPosition();
    const isMaxed = await appWindow.isFullscreen();

    const unlisten = await appWindow.onResized(({ payload: size }) => {
      clearTimeout(resizetimeout)
      resizetimeout = setTimeout(() => {
        if(userSettings.isAutoWindowCfgSave){
          isMaxed ? invoke("save_window_config", {posx: 0, posy: 0, sizex: 0, sizey: 0, useDefault: true})
          :
          invoke("save_window_config", {posx: pos.x, posy: pos.y, sizex: size.width, sizey: size.height, useDefault: false})
          
        }
      }, 1000);
    });
    return unlisten;
  };

  const move = async () => {
    let size = await appWindow.innerSize();
    const isMaxed = await appWindow.isFullscreen();

    const unlisten = await appWindow.onMoved(({ payload: position }) => {
      clearTimeout(movetimeout)
      movetimeout = setTimeout(() => {
        if(userSettings.isAutoWindowCfgSave){
          isMaxed ? invoke("save_window_config", {posx: 0, posy: 0, sizex: 0, sizey: 0, useDefault: true})
          :
          invoke("save_window_config", {posx: position.x, posy: position.y, sizex: size.width, sizey: size.height, useDefault:false})
          
        }
      }, 1000);
    });
    return unlisten;
  }; 

    (async () => {
      
      const unListenResize = await resize(); 
      const unListenMove = await move(); 
      // Return the cleanup function directly
      return () => {
        unListenResize();
        unListenMove();
      };
    })();
}, [userSettings.isAutoWindowCfgSave])

  
  return (
    <> 
      <Routes> 
        <Route path='/' element={<Home />}/>
        <Route path='/list' element={<Animes />}/>
        <Route path="*" element={<Custom404 />} />
      </Routes>

    </>
  )
}

export default App