

import { invoke } from "@tauri-apps/api";
import { useCallback, useEffect, useState } from "react";
import { useDataState } from "../context";
import { Pagination, ScrollArea } from '@mantine/core';
import AnimesTable from "../Components/AnimesTable/AnimesTable";
import { useAppState } from "../context/AppContext";
import { useViewportSize } from '@mantine/hooks';

type AnimesData = {    
  headers: string[];
  [key: string]: string[] | { hyperlink: string; value: string };
};

function Animes() {
    const {vSpacing, itemsPerPages, fontSize, isSticky} = useAppState().tableSettings;
    const { width, height } = useViewportSize();
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
      
      
      const items = (itemsPerPages === '' ? 0 : itemsPerPages)
      console.log(getData(), (activePage - 1) * (itemsPerPages === '' ? 0 : items), activePage * items);
      
      
      
      const slicedData = Object.values(getData()).slice(
        (activePage - 1) * (itemsPerPages === '' ? 0 : items),
        activePage * items
      );
     
      
      setPaginatedData(slicedData);
    }, [getData(), activePage, itemsPerPages])
    
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
   
      <Pagination
        position="center"
        className="my-5"
        total={Math.ceil(Object.entries(getData()).length / (itemsPerPages === '' ? 0 : itemsPerPages))}
        value={activePage}
        onChange={setPage}
      />
    
    <ScrollArea offsetScrollbars w={width} h={height-200} className="">

        <AnimesTable 
          spacingOptions={{verticalSpacing: vSpacing !== undefined ? vSpacing : "", fontSize: fontSize !== undefined ? fontSize: "" }}
          dataHeaders={getHeaders()} data={paginatedData} 
          tableOption={{isSticky}} 
        />
        {/* <AnimesReactTable data={paginatedData} dataHeaders={getHeaders()}/> */}
    </ScrollArea>
      
    </>
  )
}

export default Animes