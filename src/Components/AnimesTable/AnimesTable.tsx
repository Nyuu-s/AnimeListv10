import { Divider, Group, Modal, Table, TextInput, Text, Button, ScrollArea } from "@mantine/core";
import AnimesTableURL from "./AnimesTableURL";

import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import RecordRow from "./RecordRow";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "./ContextMenu";
import { Anime, T_AnimeNoID } from "../Helpers/useAnime";
import { input } from "@material-tailwind/react";
import { useDataState } from "../../context";
 

type TableOption = {
    isSticky: boolean,
}

type TableSpacing = {
    verticalSpacing: string,
    fontSize: string
}
interface DataProps {
    dataHeaders: string[],
    data: [Anime],
    tableOption: TableOption,
    spacingOptions: TableSpacing
    sortHeader: (value: {direction: boolean, header: string} | undefined) => void
}

function AnimesTable(props: DataProps) {
    const {saveData} = useDataState()
    const contextMenu = useRef(null)
    const navigate = useNavigate()
 const Options = 
    props.tableOption.isSticky ? " sticky top-0 bg-black" : ""
    const [EditMode, setEditMode] = useState(false)
    const [isShown, setIsShown] = useState(false);
    const [isSorting, SetisSorting] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [rowID, setRowID] = useState<string>('');
    const SortingStatus = [true, false, undefined]

    const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, rowDataID: string) => {
        event.preventDefault();    
        setIsShown(true);
        setPosition({ x: event.clientX, y: event.clientY });
        setRowID(rowDataID);
        console.log({ x: event.clientX, y: event.clientY }, rowDataID);
        event.stopPropagation()
    }
    const eventMouseClickHandle = (event: MouseEvent) => {

        event.preventDefault()
        if(contextMenu.current )
        {
            const ctxDiv = contextMenu.current as HTMLDivElement;
            if(!ctxDiv.contains(event.target as HTMLDivElement))
            {
                setIsShown(false)
            }
        }
    }
    const handleEscapeKey = (event: KeyboardEvent) => {  
        switch (event.key)
        {
            case 'Escape':
                setIsShown(false)
                break;
        }
    }

    useEffect(() => {
        document.addEventListener('click', eventMouseClickHandle )
        document.addEventListener('keydown', handleEscapeKey )
        return () => {
            document.removeEventListener('click', eventMouseClickHandle)
            document.removeEventListener('keydown', handleEscapeKey)
        }
    }, [])
    
    const save = () => {
       let inputs = document.querySelectorAll('input');
       const currentRecord = props.data[Number.parseInt(rowID)-1] as Anime
       inputs.forEach((inputValue) => {
       
        inputValue.id === 'url' ?
        (currentRecord[inputValue.name] as { url: string, value: string }).url = inputValue.value
        :
        (currentRecord[inputValue.name] as { url: string, value: string }).value = inputValue.value
          
       })
      
       
       saveData(3, currentRecord);
       setEditMode(false)
    }
   
  return (
      
      
      <>
      <Table  striped highlightOnHover verticalSpacing={props.spacingOptions.verticalSpacing} fontSize={props.spacingOptions.fontSize}>
            
            <thead>
                <tr className={`${Options}  `}>
                    {props.dataHeaders.map((header) => (
                        <th onClick={() => {
                         
                            
                            props.sortHeader(isSorting === 2 ? SortingStatus[isSorting] as undefined : {direction: SortingStatus[isSorting] as boolean, header} )
                            SetisSorting((prev) => (prev + 1) % 3 )
                        }} key={header}> <span className="cursor-pointer">{header} </span> </th>
                        ))}
                </tr>
            </thead>
            <tbody>
                
            {Array.isArray(props.data) && props.data.map((value, index) =>{ 

                
                
                
                return (
                        <RecordRow  handleClick={handleRowClick} ID={value.ID} data={value} dataHeaders={props.dataHeaders} />
                    
                    )
                    
            })}
            </tbody>
        </Table>
            {isShown && !EditMode && <ContextMenu setShown={setIsShown} ref={contextMenu} ID={rowID} position={position} setEdit={(v) => setEditMode(v)} />}
            
        <Modal opened={EditMode} onClose={() => setEditMode(false)} title={`Edit Row: ${rowID}`} scrollAreaComponent={ScrollArea.Autosize}>
            {/* {Object.entries(props.data).find((value) => value. == rowID )} */}
           {rowID && Object.entries(props.data[Number.parseInt(rowID)-1]).map(([header, data]) => {
            if(typeof data === 'string' || header === 'ID')
                return <></>
                return(
                    <>
                    <Text>{header}</Text>
                    <Group className="mt-3 mb-3">
                        <TextInput name={header} defaultValue={data.value} placeholder={"Value"}></TextInput>
                        <TextInput name={header} id="url" defaultValue={data.url} placeholder="URL"></TextInput>
                    </Group>
                    <Divider className="mb-3"></Divider>
                    </>
                )
            
           })} 
           <Group className="justify-around">
            <Button variant="outline" color="green" onClick={save}>SAVE</Button>
            <Button variant="outline" color="red" onClick={() => setEditMode(false)}>Cancel</Button>
           </Group>
        </Modal>
        </>


  )
}

export default AnimesTable