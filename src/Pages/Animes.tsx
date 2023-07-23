
import { useEffect, useState } from "react";
import { useDataState } from "../context";
import { Pagination, ScrollArea } from '@mantine/core';
import AnimesTable from "../Components/AnimesTable/AnimesTable";
import { useAppState } from "../context/AppContext";
import { useViewportSize } from '@mantine/hooks';



function Animes() {
    const {vSpacing, itemsPerPages, fontSize, isSticky} = useAppState().tableSettings;
    const { width, height } = useViewportSize();
    const { getData, getHeaders, AnimesContent} = useDataState();
    const [paginatedData, setPaginatedData] = useState<any>({})
    const [activePage, setPage] = useState(1);
 
    useEffect(() => {
      console.log("render table");
      
      const items = (itemsPerPages === '' ? 0 : itemsPerPages)
      const slicedData = Object.values(getData()).slice(
        (activePage - 1) * (itemsPerPages === '' ? 0 : items),
        activePage * items
      );
      setPaginatedData(slicedData);
    }, [getData(), activePage, itemsPerPages, AnimesContent])



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
       
    </ScrollArea>
      
    </>
  )
}

export default Animes