import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import RecordsTableURL from "./RecordsTableURL";
import { Checkbox } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

interface DataProps {
    dataHeaders: string[],
    data: any,
    ID: string,
    AddorDeleteMulti: (isAdd: boolean, ID: string) => void,
    handleRightClick: (event: React.MouseEvent<HTMLTableRowElement>, rowData: any) => void
    handleLeftClick: () => void
}

async function openExternalUrl(url: string) {
    try {
    //   await open(url);
    await invoke("open_external_url", {url})
      
    } catch (error) {
      
        
      console.error('Failed to open external URL:', error);
    }
  }




function RecordRow(props : DataProps) {
    const navigate = useNavigate();
    const [checkBox, setcheckBox] = useState(false)
    const handleDoubleClick = useCallback(
      () => {
        navigate("/details/"+props.ID)
      },
      [],
    )
    
    useEffect(() => {
       window.addEventListener('DeleteRows', () => setcheckBox(false) );
    
      return () => {
        window.addEventListener('DeleteRows', () => console.log("stop listening") );
      }
    }, [])
    

;
    return (
        
        
            <tr  onClick={() => props.handleLeftClick()} onContextMenu={(e) => props.handleRightClick(e, props.ID)}>
            <td><Checkbox checked={checkBox} onChange={(event) => {
                setcheckBox((prev) => !prev)
                props.AddorDeleteMulti(event.target.checked , props.ID) 

            }}></Checkbox></td>
            <td onDoubleClick={handleDoubleClick}>{props.ID}</td>
                {props.dataHeaders.map((header, i) => {
                    
                    if(header != "ID")
                    {
                        if(props.data[header] && props.data[header].url != "")
                        {
                            
                            return( <RecordsTableURL key={i} id={i} navigateFunc={handleDoubleClick} clickFunc={()=> openExternalUrl(props.data[header].url)} display={props.data[header]?.value}/>)
                        }
                        return(<td onDoubleClick={handleDoubleClick} key={i}  >{props.data[header]?.value }</td>)
                    }
                })}
            </tr>   

      
    )
}

export default RecordRow