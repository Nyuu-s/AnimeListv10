import { Divider, Group, Modal, Table, TextInput, Text, Button, ScrollArea } from "@mantine/core";

import RecordRow from "./RecordRow";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "./ContextMenu";
import { Record } from "../Helpers/useRecord";
import { useDataState } from "../../context";
import { IconArrowsSort, IconMinusVertical, IconSortAscending, IconSortDescending } from "@tabler/icons-react";


type TableOption = {
    isSticky: boolean,
    isResize: boolean
}

type TableSpacing = {
    verticalSpacing: string,
    fontSize: string
}
interface DataProps {
    dataHeaders: string[],
    data: [Record],
    tableOption: TableOption,
    spacingOptions: TableSpacing
    sortHeader: (value: {direction: boolean, header: string} | undefined) => void
}

function RecordsTable(props: DataProps) {
    const {saveData} = useDataState()
    const contextMenu = useRef(null)
    const modal = useRef<HTMLDivElement>(null)
 const Options = 
    props.tableOption.isSticky ? " sticky top-0 bg-black" : ""
    const [EditMode, setEditMode] = useState(false)
    const [isShown, setIsShown] = useState(false);
    const [isSorting, SetisSorting] = useState(0);
    const [sortingHeader, setSortingHeader] = useState<string>('');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [rowID, setRowID] = useState<string>('');
    const [multiSelect, setMultiSelect] = useState<{ [key: string]: any}>({});
   
    const SortingStatus = [true, false, undefined]
    let dragging = false;
    let dragStartX: number;
    let dragStartWidth: number;
    function handleMouseDown(event: any) {
        dragging = true;
        dragStartX = event.clientX;
        dragStartWidth = event.target.closest('th').children[0].offsetWidth;
        console.log(dragStartWidth);
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }

      function handleMouseMove(event: any) {
        if (dragging) {
          const distance = event.clientX - dragStartX;
          event.target.closest('th').children[0].style.width = `${dragStartWidth + distance}px`;
          console.log(event.target.closest('th').style.width);
        }
      }
      function handleMouseUp() {
        dragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, rowDataID: string) => {
        event.preventDefault();
        if(isShown && rowDataID === rowID)
        {
            setIsShown(false);
            return;
        }  
        setIsShown(true);
        setPosition({ x: event.clientX, y: event.clientY });
        setRowID(rowDataID);
        console.log({ x: event.clientX, y: event.clientY }, rowDataID);
        event.stopPropagation()
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
   
        document.addEventListener('keydown', handleEscapeKey )
        return () => {
            document.removeEventListener('keydown', handleEscapeKey)
        }
    }, [])

    function addOrDeleteToMultiSelect(add:boolean, ID: string) {
        if(add)
        {
            setMultiSelect((prev) => ({...prev, [ID]: true}))
        }
        else
        {
           
           setMultiSelect((prev) => {
            const { [ID]: _, ...rest } = prev;
            return rest
           })
        }
    }
    useEffect(() => {
        console.log(multiSelect);
    

    }, [multiSelect])
    useEffect(() => {
        window.addEventListener('DeleteRows', () => setMultiSelect([]) );
     
       return () => {
         window.addEventListener('DeleteRows', () => setMultiSelect([]) );
       }
     }, [])
    
    const save = () => {
  
       let inputs = modal.current?.querySelectorAll('.mantine-Modal-body input');
       const currentRecord = props.data.find((v) => parseInt(v.ID) === parseInt(rowID)) as Record
       inputs && inputs.forEach((inputValue) => {
        const inputElement = inputValue as HTMLInputElement
        inputValue.id === 'url' ?
        (currentRecord[inputElement.name] as { url: string, value: string }).url = inputElement.value
        :
        (currentRecord[inputElement.name] as { url: string, value: string }).value = inputElement.value
          
       })
      
       
       saveData(3, currentRecord);
       setEditMode(false)
    }
   
  return (
      
      
      <>
      <Table  striped highlightOnHover verticalSpacing={props.spacingOptions.verticalSpacing} fontSize={props.spacingOptions.fontSize}>
            
            <thead>
                <tr className={`${Options}  `}>
                    <th></th>
                    {props.dataHeaders.map((header) => (
                        <th   key={header}> 
                            <div className="flex">
                                <div className="flex" onClick={() => {
                                        
                                        
                                        if(header !== sortingHeader)
                                        {
                                            props.sortHeader( {direction: SortingStatus[0] as boolean, header} )
                                            SetisSorting(1);
                                        }
                                        else{
                                            props.sortHeader(isSorting === 2 ? SortingStatus[isSorting] as undefined : {direction: SortingStatus[isSorting] as boolean, header} )
                                            SetisSorting((prev) => (prev + 1) % 3 )
                                            // setSortingHeader(isSorting === 2 ? '' : header);
                                        }
                                        
                                        setSortingHeader(header);
                                    
                                    }}>
                                    <div className="cursor-pointer">{header}</div>
                                    <div className="mt-1 ml-2">
                                        {(isSorting === 0 || header !== sortingHeader) && <IconArrowsSort size={20}/>}
                                        {isSorting === 1 &&  header === sortingHeader && <IconSortAscending size={20}/>}
                                        {isSorting === 2 && header === sortingHeader && < IconSortDescending size={20}/>}
                                    </div>
                                </div>
                                
                                {props.tableOption.isResize && <div onMouseDown={handleMouseDown} className="ml-auto cursor-ew-resize"><IconMinusVertical /></div>}
                            </div> 
                             </th>
                        ))}
                </tr>
            </thead>
            <tbody>
                
            {Array.isArray(props.data) && props.data.map((value) =>{ 

                
                
                
                return (
                        <RecordRow AddorDeleteMulti={addOrDeleteToMultiSelect}  handleLeftClick={() => setIsShown(false)} handleRightClick={handleRowClick} ID={value.ID} data={value} dataHeaders={props.dataHeaders} />
                    
                    )
                    
            })}
            </tbody>
        </Table>
            {isShown && !EditMode && <ContextMenu SingleID={rowID} setShown={setIsShown} ref={contextMenu} IDs={Object.keys(multiSelect)} position={position} setEdit={(v) => setEditMode(v)} />}
            
        <Modal opened={EditMode} onClose={() => setEditMode(false)} title={`Edit Row: ${rowID}`} scrollAreaComponent={ScrollArea.Autosize}>
            {/* {Object.entries(props.data).find((value) => value. == rowID )} */}
            {/* Object.entries(props.data[Number.parseInt(rowID)-1]).map(([header, data]) */}
            <div ref={modal}>
           {rowID && Object.entries(props.data.find((value) => parseInt(value.ID) === parseInt(rowID) )?? {})?.map(([header, data]) => {

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
        </div>
           <Group className="justify-around">
            <Button variant="outline" color="green" onClick={save}>SAVE</Button>
            <Button variant="outline" color="red" onClick={() => setEditMode(false)}>Cancel</Button>
           </Group>
        </Modal>
        </>


  )
}

export default RecordsTable