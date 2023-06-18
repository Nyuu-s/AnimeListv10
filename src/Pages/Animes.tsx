

import { invoke } from "@tauri-apps/api";
import { useCallback, useEffect, useState } from "react";
import { useDataState } from "../context";
import { Pagination } from '@mantine/core';
import AnimesTable from "../Components/AnimesTable";
import { useAppState } from "../context/AppContext";

type AnimesData = {    
  headers: string[];
  [key: string]: string[] | { hyperlink: string; value: string };
};

function Animes() {
    const {vSpacing, itemsPerPages, fontSize} = useAppState().tableSettings;

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
      console.log("VALUE HAS CHANGED ", itemsPerPages);
      
      const items = (itemsPerPages === '' ? 0 : itemsPerPages)
      const slicedData = Object.values(getData()).slice(
        (activePage - 1) * (itemsPerPages === '' ? 0 : items),
        activePage * items
      );
      setPaginatedData(slicedData);
    }, [getData(), activePage, itemsPerPages])
    
    useEffect(() => {
      console.log();
      
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
        className="relative my-5"
        position="center"
        total={Math.ceil(Object.entries(getData()).length / (itemsPerPages === '' ? 0 : itemsPerPages))}
        value={activePage}
        onChange={setPage}
      />
      <AnimesTable spacingOptions={{verticalSpacing: vSpacing !== undefined ? vSpacing : "", fontSize: fontSize !== undefined ? fontSize: "" }} dataHeaders={getHeaders()} data={paginatedData} tableOption={{isSticky: true}} />
    </>
  )
}

export default Animes