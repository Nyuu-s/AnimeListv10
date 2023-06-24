
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Animes from './Pages/Animes'
import Custom404 from './Pages/404'
import { useCallback, useEffect } from 'react'
import {appWindow} from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api'





function App() {


  

useEffect(() => {
  let resizetimeout: any;
  let movetimeout: any;
  const resize = async () => {
    const pos = await appWindow.innerPosition();
    const unlisten = await appWindow.onResized(({ payload: size }) => {
      clearTimeout(resizetimeout)
      resizetimeout = setTimeout(() => {
        invoke("save_window_config", {posx: pos.x, posy: pos.y, sizex: size.width, sizey: size.height})
      }, 500);
    });
    return unlisten;
  };

  const move = async () => {
    let size = await appWindow.innerSize();
    const unlisten = await appWindow.onMoved(({ payload: position }) => {
      clearTimeout(movetimeout)
      movetimeout = setTimeout(() => {
        invoke("save_window_config", {posx: position.x, posy: position.y, sizex: size.width, sizey: size.height})
      }, 500);
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
}, [])

  
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