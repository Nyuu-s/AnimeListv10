
import { useEffect, useState } from "react";
import { useDataState } from "../context";
import { Aside, Button, Group, Pagination, ScrollArea, TextInput } from '@mantine/core';
import AnimesTable from "../Components/AnimesTable/AnimesTable";
import { useAppState } from "../context/AppContext";
import { useViewportSize } from '@mantine/hooks';
import { Anime, computeComp1, computeComp2, computeNot  } from "../Components/Helpers/useAnime";
import { IconBraces, IconSearch, IconSql } from "@tabler/icons-react";
import {ASTKinds, comparison, comparison_1, comparison_2, comparison_3, not_statement, or_1, parse, statement, statement_1, statement_2, value} from '../Components/output'



function Animes() {
    const {vSpacing, itemsPerPages, fontSize, isSticky} = useAppState().tableSettings;
    const { width, height } = useViewportSize();
    const { sortData, getData, getHeaders, AnimesContent} = useDataState();
    const [paginatedData, setPaginatedData] = useState<any>({})
    const [activePage, setPage] = useState(1);
    const [searchMode, setSearchMode] = useState(true);
    const [sortAsc, setSortAsc] = useState<{direction: boolean, header: string}| undefined>(undefined)
   
    const [filteredData, setFilteredData] = useState<Anime[]>()

    //TODO: Fix pagination when searching 
    //TODO enable sorting while filtering
    const searchData = (value: string) => {
      if(value === '')
      {
        setFilteredData(undefined)
        return;
      }
      if(searchMode)
      {
        setFilteredData( Object.values(getData()).filter((v) => {
          for (let [, propValue] of Object.entries(v)) {
            if (typeof propValue === 'object' && propValue !== null) {
              if (propValue.value && propValue.value.toString().toLocaleLowerCase().includes(value.toString().toLocaleLowerCase())) {
                return true;
              }
            } else {
              if ( propValue && propValue.toString().toLocaleLowerCase().includes(value.toString().toLocaleLowerCase())) {
                return true;
              }
            }
          }
          return false;
        }))
      }

    }
//TODO Setup query match patterns
    const queryData = (event: React.KeyboardEvent<HTMLInputElement>, value: string) => {
      if(event.key === 'Enter')
      {
        let ast = parse(value.toString()).ast;
        if(ast){
          console.log(ast);

          
          const comp = (ast.query as comparison_1);
          const comp2 = (ast.query as comparison_2);
          const not = (ast.query as statement);
         let res =  Object.values(getData()).filter((v) => {
         
         //anno in [1,2,3]
            
            return computeNot(v, not, getHeaders());
          })
          
          console.log(res);
        } 
      }
    }



    useEffect(() => {
      
      const sorting = filteredData ? filteredData : sortAsc === undefined ? Object.values(getData()) : sortData(sortAsc.direction, sortAsc.header)
      const items = (itemsPerPages === '' ? 0 : itemsPerPages)
      const slicedData = sorting?.slice(
        (activePage - 1) * (itemsPerPages === '' ? 0 : items),
        activePage * items
      );
      setPaginatedData(slicedData);
    }, [filteredData, sortAsc, activePage, itemsPerPages, AnimesContent])



  return (
    <>
   
  

      
    <TextInput onKeyDown={(event) => queryData(event, event.currentTarget.value)}  onChange={(text) => searchData(text.target.value)} className="w-1/2 mb-2 mx-auto" icon={<div className="pointer-events-auto cursor-pointer" onClick={() => setSearchMode(!searchMode)}>{searchMode ? <IconSearch /> : <IconBraces /> }</div>} /> 

    <ScrollArea offsetScrollbars w={width} h={height-200} className="">

        <AnimesTable 
          spacingOptions={{verticalSpacing: vSpacing !== undefined ? vSpacing : "", fontSize: fontSize !== undefined ? fontSize: "" }}
          dataHeaders={getHeaders().map((value) => value.header)} data={paginatedData} 
          tableOption={{isSticky}}
          sortHeader={setSortAsc} 
        />

    </ScrollArea>
    <Pagination
        position="center"
        className="mt-2"
        total={Math.ceil(Object.entries(getData()).length / (itemsPerPages === '' ? 0 : itemsPerPages))}
        value={activePage}
        onChange={setPage}
      />
    </>
  )
}

export default Animes