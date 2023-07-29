
import { useEffect, useState } from "react";
import { useDataState } from "../context";
import { Pagination, ScrollArea } from '@mantine/core';
import AnimesTable from "../Components/AnimesTable/AnimesTable";
import { useAppState } from "../context/AppContext";
import { useViewportSize } from '@mantine/hooks';
import { Anime } from "../Components/Helpers/useAnime";



function Animes() {
    const {vSpacing, itemsPerPages, fontSize, isSticky} = useAppState().tableSettings;
    const { width, height } = useViewportSize();
    const { sortData, getData, getHeaders, AnimesContent} = useDataState();
    const [paginatedData, setPaginatedData] = useState<any>({})
    const [activePage, setPage] = useState(1);
    const [sortAsc, setSortAsc] = useState<{direction: boolean, header: string}| undefined>(undefined)
   
    const [filteredData, setFilteredData] = useState<Anime[]>()



    useEffect(() => {
      console.log(sortAsc);
      
      const filtering = sortAsc === undefined ? Object.values(getData()) : sortData(sortAsc.direction, sortAsc.header);
      const items = (itemsPerPages === '' ? 0 : itemsPerPages)
      const slicedData = filtering?.slice(
        (activePage - 1) * (itemsPerPages === '' ? 0 : items),
        activePage * items
      );
      setPaginatedData(slicedData);
    }, [filteredData, sortAsc, activePage, itemsPerPages, AnimesContent])



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
          dataHeaders={getHeaders().map((value) => value.header)} data={paginatedData} 
          tableOption={{isSticky}}
          sortHeader={setSortAsc} 
        />
       
    </ScrollArea>
      
    </>
  )
}

export default Animes