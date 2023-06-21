import {Table } from "@mantine/core";
import AnimesTableURL from "./AnimesTableURL";

import { invoke } from "@tauri-apps/api";

async function openExternalUrl(url: string) {
    try {
    //   await open(url);
    await invoke("open_external_url", {url})
      
    } catch (error) {
        console.log(url);
        
      console.error('Failed to open external URL:', error);
    }
  }
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
 const Options = 
    props.tableOption.isSticky ? "text-red-500 sticky top-0 bg-black" : ""

  return (
    <Table striped highlightOnHover verticalSpacing={props.spacingOptions.verticalSpacing} fontSize={props.spacingOptions.fontSize}>
        
        <thead>
        <tr className={`${Options}  `}>
            <th>ID</th>
            {props.dataHeaders.map((header) => (
            <th  key={header}>{header}</th>
            ))}
        </tr>
        </thead>
        <tbody>
        {Object.entries(props.data).map(([key, value], index) =>{ 
            
            return (
            <tr key={key}>
                <td>{index}</td>
                {props.dataHeaders.map((header, i) => {
                    if(value[header] && value[header].url != "")
                    {
                        return( <AnimesTableURL key={i} clickFunc={()=> openExternalUrl(value[header].url)} display={value[header]?.value}/>)
                    }
                    return(<td key={i} >{value[header]?.value}</td>)
        })}
            </tr>   
            )})
        }
        </tbody>
    </Table>
  )
}

export default AnimesTable