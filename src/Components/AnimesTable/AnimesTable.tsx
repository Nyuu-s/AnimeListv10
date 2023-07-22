import { Table } from "@mantine/core";
import AnimesTableURL from "./AnimesTableURL";

import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import RecordRow from "./RecordRow";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "./ContextMenu";

type TableOption = {
    isSticky: boolean,
}

type TableSpacing = {
    verticalSpacing: string,
    fontSize: string
}
interface DataProps {
    dataHeaders: string[],
    data: object,
    tableOption: TableOption,
    spacingOptions: TableSpacing
}

function AnimesTable(props: DataProps) {
  
    const contextMenu = useRef(null)
    const navigate = useNavigate()
 const Options = 
    props.tableOption.isSticky ? " sticky top-0 bg-black" : ""

    const [isShown, setIsShown] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [rowID, setRowID] = useState<string>('');
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
            console.log("isShown: ", isShown.valueOf() , "NotContains: ", !ctxDiv.contains(event.target as HTMLDivElement)) ;
            if(!ctxDiv.contains(event.target as HTMLDivElement))
            {
                setIsShown(false)
            }
        }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
        console.log(event.key);
        
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
      
  return (
      
      
      <>
      <Table  striped highlightOnHover verticalSpacing={props.spacingOptions.verticalSpacing} fontSize={props.spacingOptions.fontSize}>
            
            <thead>
                <tr className={`${Options}  `}>
                    {props.dataHeaders.map((header) => (
                        <th  key={header}>{header}</th>
                        ))}
                </tr>
            </thead>
            <tbody>
            {Object.entries(props.data).map(([key, value], index) =>{ 
                
                return (
                    <RecordRow handleClick={handleRowClick} ID={value['ID']} data={value} dataHeaders={props.dataHeaders} />
                    
                    )
            })}
            </tbody>
        </Table>
            {isShown && <ContextMenu ref={contextMenu} ID={rowID} position={position} />}
        
        </>


  )
}

export default AnimesTable