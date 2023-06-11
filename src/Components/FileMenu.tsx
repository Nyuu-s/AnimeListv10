
import {useCallback,useState} from 'react'
import { TextInput ,  Modal , Menu, Button, Text } from '@mantine/core';

import { IconSettings, IconArrowRight, IconUserCircle, IconLogout, IconArrowsLeftRight } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { open as openDialog } from '@tauri-apps/api/dialog';
import { toast } from 'react-toastify';




type AnimeFile = {
    file: string,
    path: string
}



async function handleDialog() : Promise<AnimeFile>
{

    try {
        const selection = await openDialog({
            multiple: false,
            filters: [{
                name: 'File',
                extensions: ['xlsx']
            }]
        })
        console.log(selection);
        if(selection)
        {
            const selectionStrings = selection.toString().split('\\')
            const fileName = selectionStrings[selectionStrings.length-1]
            
            return {file:fileName, path: selection.toString()}
        }
        return {file:"", path: ""}
    } catch (error) {
        console.log(error);
        return {file:"", path: ""}
    }
}


function FileMenu() {
   
    const [opened, { open, close }] = useDisclosure(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [dataAlreadyImportedMessage, setDataAlreadyImportedMessage] = useState<string | undefined>(undefined);
    const [value, setValue] = useState<AnimeFile | undefined>(undefined);
    const onWindowClose = useCallback(async () => {
        const { appWindow } = await import("@tauri-apps/api/window");
        appWindow.close();
      }, []);

    const onInvoke = useCallback(async (func: string, args: object) => {
        const { invoke } = await import('@tauri-apps/api');
        return invoke(func, {...args})
    }, []);

  return (

    <Menu shadow="md" width={200} offset={2}>
        <Menu.Target>
            <Button >File</Button>
        </Menu.Target>

        <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item rightSection={<Text size="xs" color="dimmed">Not yet</Text>} icon={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item onClick={async () => {
                try {
                    await onInvoke('check_current_data', {});
                    setDataAlreadyImportedMessage(undefined);
                    console.log("log everything is fine");
                } catch (error: any) {
                    setDataAlreadyImportedMessage("Data already exist do you want to overwrite it all? "); 
                }
               
               open()
                
                }} icon={<IconArrowRight size={14} />}>Import</Menu.Item>
            <Menu.Item rightSection={<Text size="xs" color="dimmed">Not yet</Text>} icon={<IconUserCircle size={14} />}>Profiles</Menu.Item>
            {/* <Menu.Item
            icon={<IconSearch size={14} />}
            rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
            >
            Search
            </Menu.Item> */}

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item rightSection={<Text size="xs" color="dimmed">Not yet</Text>} icon={<IconArrowsLeftRight size={14} />}>Export to CSV</Menu.Item>
            <Menu.Item color="red" onClick={() => onWindowClose()} icon={<IconLogout size={14} />}>Exit</Menu.Item>
        </Menu.Dropdown>
            
        <Modal opened={opened} onClose={close} title="Import File(s)">
         <div  className='flex flex-col sm:flex-row justify-between items-center '>


                
                <TextInput className='w-4/6'  placeholder={`${value != undefined ? value.file : '.xlsx'}`} label="Select File" disabled  withAsterisk />
                <Button className='mt-6 sm:w-1/4 w-full' compact variant="outline" color="indigo" onClick={() => {
                    handleDialog().then((v) => {
                        setValue(v)
                        if(dataAlreadyImportedMessage !== undefined)
                        {
                            setIsButtonDisabled(true);
                            toast.warn(
                                <div>
                                  <p>Importing will overwrite the existing data. Do you still want to proceed?</p>
                                  <div className='flex justify-start  mt-5'>

                                  <Button className='mr-5' compact variant="light" color="yellow" onClick={() => {
                                    console.log("yes")
                                    toast.dismiss("confirmYesNo")
                                    setIsButtonDisabled(false);
                                  }}>
                                    Yes
                                  </Button>
                    
                                  <Button compact variant="light" color="green" onClick={() => {
                                    console.log("no")
                                    toast.dismiss("confirmYesNo")
                                    close()
                                    }}>No</Button>
                                  </div>
                                </div>,
                                {
                                  autoClose: false, // Disable auto-close
                                  closeOnClick: false, // Disable closing on click
                                  draggable: false, // Disable dragging
                                  closeButton: false, // Disable close button
                                  position: toast.POSITION.BOTTOM_CENTER,
                                  toastId: 'confirmYesNo',
                                  theme: 'dark'
                                }
                              );
                        }
                    })
             
                }} >Select a file</Button>
            
  
         </div>
         <div className='w-full flex justify-between '>
            <div className='w-4/6 flex justify-start mt-5 text-red-600'>
                    {dataAlreadyImportedMessage}
            </div>

            <div className=' flex justify-end mt-5'>
                <Button disabled={value == undefined || isButtonDisabled} onClick={async ()  => {
                    setIsButtonDisabled(true);
                    let result = onInvoke("import_file", {  dataFilePath: value?.path });
                    toast.promise(
                       result,
                        {
                            
                            pending: 'Loading data...',
                            success: { render({}){       
                                    close();
                                    setValue(undefined);
                                    setIsButtonDisabled(false);
                                    return `File parsed successfully 👌`
                                }
                            },
                            error: {
                                render({data}){   
                                    setIsButtonDisabled(false);
                                    // When the promise reject, data will contains the error
                                    return `Error: ${data}`
                                }
                            } 
                        },
                        {
                            theme: 'dark',
                            position: 'bottom-center'
                        }
                    ) 
                }}> Import </Button>
            
            </div>
         </div>
        </Modal>
    </Menu>
  )
}

export default FileMenu