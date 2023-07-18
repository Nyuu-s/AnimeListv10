import { Table } from "@mantine/core";
import AnimesTableURL from "./AnimesTableURL";

import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import RecordRow from "./RecordRow";
import { useState } from "react";
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
        
      }
  return (
 

      <Table   striped highlightOnHover verticalSpacing={props.spacingOptions.verticalSpacing} fontSize={props.spacingOptions.fontSize}>
            
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
            {isShown && <ContextMenu ID={rowID} isShown={true} position={position} />}
        </Table>


  )
}

export default AnimesTable