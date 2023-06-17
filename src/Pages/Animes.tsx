
import { Table } from "@mantine/core";
import { invoke } from "@tauri-apps/api";
import { useCallback, useEffect, useState } from "react";
import { useDataState } from "../context";
import { Pagination } from '@mantine/core';
import { usePagination } from '@mantine/hooks';


type AnimesData = {    
  headers: string[];
  [key: string]: string[] | { hyperlink: string; value: string };
};



// interface Element {
//     [key: string]: {value: string, hyperlink: string}; // Define the properties of your Element type
//   }
function Animes() {
    const {set, getData, setDataOnly, setHeadersOnly, isEmpty, getHeaders} = useDataState();
    const [paginatedData, setPaginatedData] = useState<object>({})
    const [activePage, setPage] = useState(1);
    // const {active} = usePagination({});
    const extractDataOnly = useCallback(
      (obj: AnimesData): object => {
       return (({ headers: _, ...rest }) => rest)(obj); //remove headers from obj return a copy
      },
      [],
    );
    const extractHeaders = useCallback(
      (obj: AnimesData ): Array<string> => {
        return obj.headers;
      },
      [],
    );

    useEffect(() => {
      const t = Object.values(getData()).slice(
        (activePage - 1) * 10,
        activePage * 10
      );
      setPaginatedData(t);
    }, [getData(), activePage])
    
    useEffect(() => {
      
      if(isEmpty.all || isEmpty.data || isEmpty.headers){
        const fetchData = async () => {
            const data: AnimesData = await invoke("get_data", {});
            //set data + headers object in context
            isEmpty.all && set(data);
            //set data  object in context
            isEmpty.data && setDataOnly(extractDataOnly(data));
            //set headers object in context
            isEmpty.headers && setHeadersOnly(extractHeaders(data))
        }
        fetchData();
      }

    }, [isEmpty.all])

  return (
    <>
      <Table>

          <thead>
          <tr>
            <th>ID</th>
          {getHeaders().map((header) => (
            <th>{header}</th>
          ))}
          </tr>
          </thead>
          <tbody>
  {       Object.entries(paginatedData).map(([key, value], index) =>{ 
        
    return (
      <tr key={key}>
        <td>{index}</td>
        {getHeaders().map((header) => (
          <td>{value[header]?.value}</td>
        ))}
      </tr>
          
          
        )})
  }
          </tbody>
    </Table>
    <Pagination
        position="center"
        total={Math.ceil(Object.entries(getData()).length / 10)}
        value={activePage}
        onChange={setPage}
      />
    </>
  )
}

export default Animes