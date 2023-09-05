
import { Button, Select, Group, Modal, Pagination, ScrollArea, TextInput } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { IconBraces, IconPlus, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import RecordsTable from "../Components/RecordsTable/RecordTable";
import { Record, FSM, TDataHeaders } from "../Components/Helpers/useRecord";
import { parse } from '../Components/output';
import { useDataState } from "../context";
import { useAppState } from "../context/AppContext";



function Records() {
    const {vSpacing, itemsPerPages, fontSize, isSticky, isResize} = useAppState().tableSettings;
    const { width, height } = useViewportSize();
    const { sortData, getData, getHeaders, saveData, RecordsContent} = useDataState();
    const [paginatedData, setPaginatedData] = useState<any>({})
    const [activePage, setPage] = useState(1);
    const [searchMode, setSearchMode] = useState(true);
    const [isAddRowOpened, setisAddRowOpened] = useState(false);
    const [isAddHeaderOpened, setisAddHeaderOpened] = useState(false);
    const [sortAsc, setSortAsc] = useState<{direction: boolean, header: string}| undefined>(undefined)
    const [headerInput, setheaderInput] = useState({header: '', headerType: 'string'})
    const [filteredData, setFilteredData] = useState<Record[]>()

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
        console.log(ast);
        let res =  Object.values(getData()).filter((v) => {

          if(ast)
            return FSM[ast.query.kind]?.(v, ast.query, getHeaders()) ?? false;
        })
          
        setFilteredData(res);
         
        
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
    }, [filteredData, sortAsc, activePage, itemsPerPages, RecordsContent])
  return (
    <>
   
  
    <div className='flex justify-evenly w-full'>
      <Button className='w-1/12' variant='outline' color='green' onClick={() => {
        setisAddRowOpened(true)
      }}> <IconPlus size={20} /> Record </Button>
      <TextInput onKeyDown={(event) => queryData(event, event.currentTarget.value)}  onChange={(text) => searchData(text.target.value)} className="w-1/2" icon={<div className="pointer-events-auto cursor-pointer" onClick={() => setSearchMode(!searchMode)}>{searchMode ? <IconSearch /> : <IconBraces /> }</div>} /> 
      <Button  className='w-1/12' variant='outline' color='lime' onClick={()=> {  
      setisAddHeaderOpened(true)
      }} > <IconPlus size={20} /> Header </Button>
    </div>

  <Modal title={"Add Record"} opened={isAddRowOpened} onClose={() => setisAddRowOpened(false)}>
    <div>
      {getHeaders().map((value, i) => {
        if(value.header !== 'ID')
        {
          return <div key={i} className='mt-2'> <TextInput label={value.header}  ></TextInput></div>
        }
      } )}
      <div className='flex justify-center w-full'>
        <Button className='mx-auto  mt-3 ' variant='gradient'>Add</Button>
      </div>
    </div>
  </Modal>
  <Modal title={"Add Header"} opened={isAddHeaderOpened} onClose={() => setisAddHeaderOpened(false)}>
    <div>
      <div className='mt-2'> <TextInput onChange={(event) => {
        setheaderInput({...headerInput, header: event.target.value})
      }} className='header-name-input' placeholder={"New Header"}  /></div>
      <div className='my-5'> <Select 
        onChange={(value) => setheaderInput({...headerInput, headerType: value ? value : ''}) }
        className='header-type-input'
        label="Header Type"
        defaultValue={"string"}
        data={[
        { value: 'numeric', label: 'Numbers' },
        { value: 'string', label: 'Text' },
        ]} 
        dropdownPosition='bottom'/> </div>
      <div className='flex justify-center w-full my-5'>
        <Button onClick={() => {
          saveData(1, [...getHeaders(), headerInput] )
        }} className='mx-auto  mt-3 ' variant='gradient'>Add</Button>
      </div> 
    </div>
  </Modal>
    <ScrollArea offsetScrollbars w={width} h={height-200} className="">

        <RecordsTable
          totalRecords={filteredData ? filteredData.length : Object.values(getData()).length} 
          spacingOptions={{verticalSpacing: vSpacing !== undefined ? vSpacing : "", fontSize: fontSize !== undefined ? fontSize: "" }}
          dataHeaders={getHeaders().map((value) => value.header)} data={paginatedData} 
          tableOption={{isSticky, isResize}}
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

export default Records
