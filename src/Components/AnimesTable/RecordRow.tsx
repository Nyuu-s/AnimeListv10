import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import AnimesTableURL from "./AnimesTableURL";

interface DataProps {
    dataHeaders: string[],
    data: any,
    ID: string,
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



;
    return (
        
        
            <tr onDoubleClick={() =>   navigate("/details/"+props.ID)} onClick={() => props.handleLeftClick()} onContextMenu={(e) => props.handleRightClick(e, props.ID)}>
            <td >{props.ID}</td>
                {props.dataHeaders.map((header, i) => {
                    
                    if(header != "ID")
                    {
                        if(props.data[header] && props.data[header].url != "")
                        {
                            
                            return( <AnimesTableURL key={i} id={i} clickFunc={()=> openExternalUrl(props.data[header].url)} display={props.data[header]?.value}/>)
                        }
                        return(<td key={i}  >{props.data[header]?.value }</td>)
                    }
                })}
            </tr>   

      
    )
}

export default RecordRow