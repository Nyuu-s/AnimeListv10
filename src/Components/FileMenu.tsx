
import { Button, Menu, Modal, Text, TextInput } from '@mantine/core';
import { useCallback, useState } from 'react';

import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconArrowRight, IconLogout, IconSettings, IconTrash, IconUserCircle } from '@tabler/icons-react';
import { open as openDialog } from '@tauri-apps/api/dialog';
import { toast } from 'react-toastify';
import { useDataState } from '../context';
import { dialog } from '@tauri-apps/api';





type RecordFile = {
    file: string,
    path: string
}



async function handleDialog() : Promise<RecordFile>
{

    try {
        const selection = await openDialog({
            multiple: false,
            filters: [{
                name: 'File',
                extensions: ['xlsx']
            }]
        })

        if(selection)
        {
            const selectionStrings = selection.toString().split('\\')
            const fileName = selectionStrings[selectionStrings.length-1]
            
            return {file:fileName, path: selection.toString()}
        }
        return {file:"", path: ""}
    } catch (error) {
  
        return {file:"", path: ""}
    }
}


function FileMenu() {
    const {setBothDataAndHeaders} = useDataState();
    const [opened, { open, close }] = useDisclosure(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [dataAlreadyImportedMessage, setDataAlreadyImportedMessage] = useState<string | undefined>(undefined);
    const [value, setValue] = useState<RecordFile | undefined>(undefined);
    const onWindowClose = useCallback(async () => {
        const { appWindow } = await import("@tauri-apps/api/window");
        appWindow.close();
      }, []);
      const onDeleteAllData = useCallback(async () => {

        try {
            let res = await dialog.ask("This will remove everything. \n Are you sure ? ", {type: "warning"})
            if(!res)
                return;
        } catch (error) {
            toast.error("Something went wrong")
        }
        toast.promise(onInvoke("delete_all", {}), 
        {
            pending: 'Removing All Data...',
            success: 'Successfuly removed all data !',
            error: {
                render({data}) {
                  return `${data}`
                }
            }
        },
        {
            theme: 'colored',
            position: "top-center"
        })
        setBothDataAndHeaders({})
      }, []);


      

    const onInvoke = useCallback(async (func: string, args: object) => {
        const { invoke } = await import('@tauri-apps/api');
        return invoke(func, {...args})
    }, []);

  return (

    <Menu  shadow="md" width={200} offset={2}>
        <Menu.Target >
            <Button >File</Button>
        </Menu.Target>

        <Menu.Dropdown>
            <Menu.Label>Configuration</Menu.Label>
            <Menu.Item disabled rightSection={<Text size="xs" color="dimmed">Not yet</Text>} icon={<IconSettings size={14} />}>Settings</Menu.Item>

            <Menu.Item disabled rightSection={<Text size="xs" color="dimmed">Not yet</Text>} icon={<IconUserCircle size={14} />}>Profiles</Menu.Item>
            {/* <Menu.Item
            icon={<IconSearch size={14} />}
            rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
            >
            Search
            </Menu.Item> */}

            <Menu.Divider />

            <Menu.Label>Data</Menu.Label>
            <Menu.Item onClick={async () => {
                try {
                    await onInvoke('check_current_data', {});
                    setDataAlreadyImportedMessage(undefined);
              
                } catch (error: any) {
                    setDataAlreadyImportedMessage("Data already exist do you want to overwrite it all? "); 
                }
               
               open()
                
                }} icon={<IconArrowRight size={14} />}>Import</Menu.Item>
            <Menu.Item rightSection={<Text size="xs" color="dimmed">CSV</Text>} icon={<IconArrowLeft size={14} />}  onClick={async () => {
                            toast.promise(
                                onInvoke('export_csv', {}),
                                {
                                  pending: 'Preparing export',
                                  success: 'CSV Export was successful👌',
                                  error: 'Something went wrong durng export'
                                },
                                {
                                    theme: 'dark',
                                    position: 'top-center'
                                }
                            )
   
              
                        }}>
                Export 
            </Menu.Item>
            <Menu.Item rightSection={<Text size="xs" color="dimmed">XLSX</Text>} icon={<IconArrowLeft size={14} />}  onClick={async () => {
                            toast.promise(
                                onInvoke('export_xlsx', {}),
                                {
                                  pending: 'Preparing export',
                                  success: 'XLSX Export was successful👌',
                                  error: 'Something went wrong durng export'
                                },
                                {
                                    theme: 'dark',
                                    position: 'top-center'
                                }
                            )
   
              
                        }}>
                Export
            </Menu.Item>
            
            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item color="red" onClick={()=> onDeleteAllData()} icon={<IconTrash size={14} />}>Delete Current Data</Menu.Item>
            <Menu.Item color="red" onClick={() => onWindowClose()} icon={<IconLogout size={14} />}>Exit</Menu.Item>
        </Menu.Dropdown>
            
        <Modal opened={opened} onClose={close} title="Import File(s)">
         <div  className='flex flex-col sm:flex-row justify-between items-center '>


                
                <TextInput className='w-4/6'  placeholder={`${value != undefined ? value.file : '.xlsx'}`} label="Select File" disabled  withAsterisk />
                <Button className='mt-6 sm:w-1/4 w-full' compact variant="outline" color="indigo" onClick={() => {
                    handleDialog().then((v) => {
                        
                        setValue(v)
                        if(dataAlreadyImportedMessage !== undefined && v.file !== '' || v.path !== '')
                        {
                            setIsButtonDisabled(true);
                            toast.warn(
                                <div>
                                  <p>Importing will overwrite the existing data. Do you still want to proceed?</p>
                                  <div className='flex justify-start  mt-5'>

                                  <Button className='mr-5' compact variant="outline" color="yellow" onClick={() => {
                                
                                    toast.dismiss("confirmYesNo")
                                    setIsButtonDisabled(false);
                                  }}>
                                    Yes
                                  </Button>
                    
                                  <Button compact variant="outline" color="green" onClick={() => {
                                
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
                                  position: toast.POSITION.TOP_RIGHT,
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
                            success: { render({data}: any){       
                                    close();
                                    setValue(undefined);
                                    setIsButtonDisabled(false);
                                    setBothDataAndHeaders(data);
                                    ;
                                    
                                    
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
                            position: 'top-right'
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