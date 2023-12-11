import { Divider, Group, Modal, Table, TextInput, Text, Button, ScrollArea, Checkbox, Menu, Select } from "@mantine/core";

import RecordRow from "./RecordRow";
import { useEffect, useRef, useState } from "react";
import RecordContextMenu from "./RecordContextMenu";
import { Record } from "../Helpers/useRecord";
import { useDataState } from "../../context";
import { IconAdjustments, IconArrowsSort, IconMinusVertical, IconSortAscending, IconSortDescending, IconTrash } from "@tabler/icons-react";
import { useClickOutside, useViewportSize } from "@mantine/hooks";
import { toast } from "react-toastify";


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
    spacingOptions: TableSpacing,
    totalRecords: number,
    sortHeader: (value: {direction: boolean, header: string} | undefined) => void
}

function RecordsTable(props: DataProps) {
    const {saveData, deleteHeader, getPossibleValues, getHeaders, updateColumn, restrictedValues} = useDataState()
    const modal = useRef<HTMLDivElement>(null)
 const Options = 
    props.tableOption.isSticky ? " sticky top-0 bg-black" : ""
    const [EditMode, setEditMode] = useState(false)
    const [isShown, setIsShown] = useState(false);
    const [isHeaderMenuShown, setIsHeaderMenuShown] = useState(false);
    const [isSorting, SetisSorting] = useState(0);
    const [sortingHeader, setSortingHeader] = useState<string>('');
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hPosition, setHPosition] = useState({ x: 0, y: 0 });
    const [selectedHeader, setselectedHeader] = useState("")
    const [rowID, setRowID] = useState<string>('');
    const [multiSelect, setMultiSelect] = useState<{ [key: string]: any}>({});
    const [selectAll, setSelectAll] = useState(false)
    const headerMenuRef = useClickOutside(() => setIsHeaderMenuShown(false));
    const rowMenuRef = useClickOutside(() => setIsShown(false));
    const { height } = useViewportSize();
    const SortingStatus = [true, false, undefined]
    let dragging = false;
    let dragStartX: number;
    let dragStartWidth: number;
    function handleMouseDown(event: any) {
        dragging = true;
        dragStartX = event.clientX;
        dragStartWidth = event.target.closest('th').children[0].offsetWidth;
        
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }

      function handleMouseMove(event: any) {
        if (dragging) {
          const distance = event.clientX - dragStartX;
          event.target.closest('th').children[0].style.width = `${dragStartWidth + distance}px`;
         
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
        event.stopPropagation()
    }
    const handleEscapeKey = (event: KeyboardEvent) => {  
        switch (event.key)
        {
            case 'Escape':
                setIsShown(false)
                setIsHeaderMenuShown(false)
                break;
        }
    }

    useEffect(() => {
   
        document.addEventListener('keydown', handleEscapeKey )
        return () => {
            document.removeEventListener('keydown', handleEscapeKey)
        }
    }, [])

    useEffect(() => {
      //loop all data and add them to multi select
        for (let index = 0; index < props.totalRecords; index++) {
            addOrDeleteToMultiSelect(selectAll, `${index+1}` )
            
        }
      
    }, [selectAll])
    

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
   const [defineValueModal, setDefineValueModal] = useState(false)
   const [defineValueData, setDefineValueData] = useState<Array<{value: string, label:string }>>([])
   const [selectdefineValue, setdefineValue] = useState<string | null >(null);

  return (
      
      
      <>
      <Modal opened={defineValueModal} onClose={()=> setDefineValueModal(false)} >
        <Modal.Title><div className="text-center text-lg"> Restrict possible values for  <span className="font-semibold">{selectedHeader.toUpperCase()}</span></div></Modal.Title>
            <Modal.Body h={400}>
            <div className="mt-5">All current values are listed down there.   </div>
            <div className="mb-5">When restricting, <span className="text-yellow-500 ">all non-matching values will be cleared out.</span></div> 
           
             
            <Select
            
             placeholder="Pick value to delete or add a new one"
             value={selectdefineValue}
             onChange={(e) => setdefineValue(e)}
             data={defineValueData.sort((a, b) => a.value > b.value ? 1 : -1)} 
             dropdownPosition="bottom"
             defaultValue={null}
             searchable
             clearable
             creatable
             getCreateLabel={(query) => `+ Create ${query}`}
             onCreate={(query) => {
                const item = { value: query.toLowerCase(), label: query };
                setDefineValueData((current) => [...current, item]);
                return item;
              }}
              
             />
             
            <Button className={"mt-5"} variant="outline" color="red" onClick={() => {
                
                
                if(selectdefineValue)
                {
                    setDefineValueData((current) => {
                        let arr = [...current.filter((v) => v.value !== selectdefineValue.toLocaleLowerCase(), 1)]
                        return arr
                    });
                    setdefineValue(null)
              
                    
                    
                }
            }}>Delete Current</Button>
            <Button className={"mt-5 ml-5"} variant="filled" color="green" onClick={() => {    
                let toBeRestricted = defineValueData.map((v) => v.label);            
              
                updateColumn(selectedHeader, toBeRestricted) ?
                toast.success("Done!", {theme: 'dark', position: "top-center"}) : toast.error("Something went wrong sorry!", {theme: 'dark', position: "top-center"}) 
            }}>Restrict</Button>
             
            </Modal.Body>
      </Modal>
      <div
      ref={headerMenuRef}
        style={{ top: Math.abs(height - hPosition.y ) < 100 ? hPosition.y -100: hPosition.y - 30  , left: hPosition.x + 10 }}
        className="fixed z-50 h-40">
          <Menu shadow="md" opened={isHeaderMenuShown}  closeOnClickOutside closeOnItemClick  width={200}>
            <Menu.Dropdown  >
                <ScrollArea >
                    <Menu.Label>Header: {selectedHeader} </Menu.Label>
                    <Menu.Item icon={<IconAdjustments size={14} /> } disabled={getHeaders().find((v) => v.header === selectedHeader)?.headerType === 'numeric'} onClick={() => {
                        
                        setDefineValueData(getPossibleValues(selectedHeader).map((el) => ({value: el.toLowerCase(), label: el})))
                        setDefineValueModal(true)
                    }}>Restrict possible values</Menu.Item>
                    <Menu.Item color="red" icon={<IconTrash size={14} />} onClick={()=>{
                        if(selectedHeader !== 'ID')
                        {
                            deleteHeader(selectedHeader)
                        }
                        else
                        {
                            toast.error('Do not remove this header', {theme: 'colored'})
                        }
                        setIsHeaderMenuShown(false)
                       
                    //    saveData(1, test) 
                    }}>Delete</Menu.Item>
                   
                  
                </ScrollArea>
            </Menu.Dropdown>
            </Menu>
        </div>
      <Table  striped highlightOnHover verticalSpacing={props.spacingOptions.verticalSpacing} fontSize={props.spacingOptions.fontSize}>
            
            <thead>
                <tr className={`${Options}  `} >
                    <th id="checkAll"><Checkbox onChange={(event) => setSelectAll(event.target.checked)}/></th>
                    {props.dataHeaders.map((header) => (
                        <th   key={header}> 
                            <div className="flex">
                                <div onContextMenu={(e) => {
                                        e.preventDefault()
                                        setHPosition({x: e.clientX, y: e.clientY})
                                        setselectedHeader(header)
                                        setIsHeaderMenuShown(true)
                                    }} className="flex" onClick={() => {
                                        
                                        
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
                                    <div  className="cursor-pointer">{header}</div>
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
                        <RecordRow key={value.ID} defaultCheckboxesValue={selectAll} AddorDeleteMulti={addOrDeleteToMultiSelect}  handleLeftClick={() => setIsShown(false)} handleRightClick={handleRowClick} ID={value.ID} data={value} dataHeaders={props.dataHeaders} />
                    
                    )
                    
            })}
            </tbody>
        </Table>
            {isShown && !EditMode && <RecordContextMenu  SingleID={rowID} setShown={setIsShown} ref={rowMenuRef} IDs={Object.keys(multiSelect)} position={position} setEdit={(v) => setEditMode(v)} />}
            
        <Modal opened={EditMode} onClose={() => setEditMode(false)} title={`Edit Row: ${rowID}`} scrollAreaComponent={ScrollArea.Autosize}>
            {/* {Object.entries(props.data).find((value) => value. == rowID )} */}
            {/* Object.entries(props.data[Number.parseInt(rowID)-1]).map(([header, data]) */}
            <div ref={modal}>
           {rowID && Object.entries(props.data.find((value) => parseInt(value.ID) === parseInt(rowID) )?? {})?.map(([header, data], i) => {

            if(typeof data === 'string' || header === 'ID')
                return <></>
            return(
                <>
                <div key={i}>
                    <Text>{header}</Text>
                    <Group className="mt-3 mb-3 flex justify-between">
                    {
                        restrictedValues[header] ? <Select  name={header} defaultValue={data.value.toLowerCase()} clearable  placeholder='Pick one' data={restrictedValues[header].sort().map((v) => ({value: v.toLowerCase(), label: v}))                  }/>:
                        <TextInput name={header} defaultValue={data.value} placeholder={"Value"}></TextInput>
                    }
                        
                        <TextInput name={header} id="url" defaultValue={data.url} placeholder="URL"></TextInput>
                    </Group>
                    <Divider className="mb-3"></Divider>
                </div>
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