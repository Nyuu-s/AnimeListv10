
import { Table } from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

interface Element {
    [key: string]: {value: string, hyperlink: string}; // Define the properties of your Element type
  }
function Animes() {
    const [elements, setElements] = useState<Element[]>();
    const [headers, setHeaders] = useState<Array<string>>();


    useEffect(() => {
        const fetchData = async () => {
            const [data, dataHeaders]: [Element[], string[]] = await invoke("get_data", {});
            
            setHeaders(dataHeaders);
            setElements(data);
        }
        fetchData();
        
        
      return () => {
        
      }
    }, [])
    


  return (
    <Table>
        <thead>
        <tr>
            <th>Element position</th>
            <th>Element name</th>
            <th>Symbol</th>
            <th>Atomic mass</th>
        </tr>
        </thead>
        <tbody>
{        elements && headers && elements.map((element, index) => (
        <tr key={index}>
          <td>{element[headers[0]].value}</td>
          <td>{element[headers[0]].value}</td>
          <td>{element[headers[0]].value}</td>
          <td>{element[headers[0]].value}</td>
        </tr>
      ))
 }
        </tbody>
  </Table>
  )
}

export default Animes