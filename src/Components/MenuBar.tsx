
import { useState, useEffect, useCallback } from 'react'
import { useMantineTheme, Image } from '@mantine/core';
import { FaWindowMinimize, FaRegWindowMaximize, FaRegWindowRestore } from 'react-icons/fa';
import {MdClose} from 'react-icons/md';
import FileMenu from './FileMenu';
import { listen } from "@tauri-apps/api/event";
import CustomDialog from './ThreeButtonDialog';


// todo incorporate style so menubar match the theme
function MenuBar() {
    const [isMaximized, setisMaximized] = useState<boolean>(false)
    const {colors, colorScheme} = useMantineTheme();
    const [showDialog, setShowDialog] = useState(false);

    const handleDialogButtonClick = (buttonIndex: number) => {
      console.log(`Button ${buttonIndex} clicked`);
      setShowDialog(false);
    };
    
    const onClose = useCallback(async () => {
        const { appWindow } = await import("@tauri-apps/api/window");
        const { invoke , dialog} = await import("@tauri-apps/api");

        try {

          // setShowDialog(true) TO USE 3 BUTTON DIALOG
          await invoke('safe_to_quit');
        } catch (error: any ) {
          
          if(error.status && !await dialog.confirm(error.message, { title: 'Tauri', type: 'warning', okLabel: 'Quit' }))
            return;
        }
        
        appWindow.close();
          
        
        // await appWindow.emit("windowRequestClose");
        // appWindow.close()
      }, []);
    
    const onMinimize = useCallback(async () => {
        const { appWindow } = await import("@tauri-apps/api/window");
        appWindow.minimize();
      }, []);
    
      const onMaximize = useCallback(async (max: boolean) => {
        const { appWindow } = await import("@tauri-apps/api/window");
    
        max ?  appWindow.maximize() : appWindow.unmaximize();
       
      }, []);
    
      useEffect(() => {
        const unlisten = listen<string>('tauri://close-requested', onClose);
        return () => {
          unlisten.then(unsub => unsub());
        }
      }, []);
      
      
 
    useEffect(() => {

       onMaximize(isMaximized)
    
    }, [isMaximized])
    


  return (


        <div data-tauri-drag-region style={{backgroundColor: colors.dark[6], zIndex: 1000}} className='h-7 fixed w-full flex justify-between left-0 top-0 z-50' >
         <CustomDialog
                    show={showDialog}
                    title="Three Button Dialog"
                    message="Choose an option:"
                    onButtonClick={handleDialogButtonClick}
                  />
            <div data-tauri-drag-region className='flex justify-start items-center '>
                <Image src={"/icon1.png"} width={30} ></Image>
                <FileMenu />
            </div>
            <div data-tauri-drag-region className='select-none flex justify-end items-center '>
                
                <div onClick={() => onMinimize()}  className={`cursor-pointer hover:bg-gray-200 ${colorScheme == 'dark' ? 'text-white hover:text-black ' : 'text-black hover:text-white '}  inline-flex justify-center items-center w-12 h-6`} id="titlebar-minimize">
                    <FaWindowMinimize className={` mb-2 `} /> 
                </div>
                <div onClick={() => { setisMaximized(() => (!isMaximized)) }} className={`cursor-pointer hover:bg-gray-200 ${colorScheme == 'dark' ? 'text-white hover:text-black ' : 'text-black hover:text-white '}  inline-flex justify-center items-center w-12 h-6`} id="titlebar-maximize">
                    { !isMaximized ? <FaRegWindowMaximize /> : <FaRegWindowRestore /> }
                </div>
                <div onClick={() => onClose()} className={`cursor-pointer hover:bg-red-500 ${colorScheme == 'dark' ? 'text-white hover:text-black ' : 'text-black hover:text-white '}  inline-flex justify-center items-center w-12 h-6`} id="titlebar-close">
                    <MdClose size={25}/>
                </div>
            </div>


        </div>

  
  )
}

export default MenuBar