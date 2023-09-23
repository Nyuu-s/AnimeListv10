import { Button, Center, Group, NumberInput, Select, Table, TextInput, TransferList, TransferListData, TransferListItem } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDataState } from '../context';
import SimpleStatTable from './SimpleStatTable';
import { T_RecordNoID  } from './Helpers/useRecord';


function SimpleStatTableForm() {

    
    const {getHeaders,getData, getPossibleValues, restrictedValues, addSimpleStatTable} = useDataState();
    const HeaderList = useMemo(() => getHeaders().map((v) => ({value: v.header, label: v.header})).sort((a, b) => a.label > b.label ? 1 : -1), [])

    const getCountsFor2Headers = useCallback((headers: string[], values:[TransferListItem[], TransferListItem[]]) => {
        const data = Object.values(getData());
        let result: number[][] = []
       
        
        values[0].forEach((cols, i) => {
            result[i] = []
            values[1].forEach((rows, j) => {
                let res =  data.filter((v) => {
                    
                    let noid = v as T_RecordNoID
                    let noidValue1: string =  `${noid[headers[0]].value}`;
                    let noidValue2: string = `${noid[headers[1]].value}`;
                   
                    
                    return noidValue1.toLowerCase().includes(`${cols.value.toLowerCase()}`) && noidValue2.toLowerCase().includes(`${rows.value.toLowerCase()}`)

                })
            result[i][j] = (res ? res.length : 0);
        })
    })
        return result
    }, [])

    const initialValues: TransferListData = [
        [],
        []
    ]  
    const [transferdataRow, setTransferDataRow] = useState<TransferListData>(initialValues);
    const [transferdataCol, setTransferDataCol] = useState<TransferListData>(initialValues);
    const [RowSelect, setRowSelect] = useState<null | string>(null);
    const [ColSelect, setColSelect] = useState<null | string>(null)
    const [currentMaxSize, setcurrentMaxSize] = useState({MaxRows: 1, MaxCols: 1})
    const [tableTitle, setTableTitle] = useState("")
    const MAX_SIZE_ROWS = 5;
    const MAX_SIZE_COLS = 5;




   const possibleValuesByHeaders = useMemo(() => {
        return (
            {
                ...HeaderList.reduce((acc: {[key: string]: Array<{value: string, label: string}>}, v) => {
                    if(!acc[v.value])
                    {
                        
                        
                        if(restrictedValues[v.value])
                        {
                             acc[v.value] = restrictedValues[v.value].reduce((acc: Array<{value: string, label: string}>, currentString) => {
                                if(currentString !== '') {
                                    acc.push({value: currentString, label: currentString});
                                }
                                return acc;
                             }, []);
                        }
                        else
                        {
                            acc[v.value] = getPossibleValues(v.value).reduce((accumulator: Array<{value: string, label: string}>, currentString) => {
                                if(currentString !== '') {
                                    accumulator.push({value: currentString, label: currentString});
                                  }
                                  return accumulator;
                            }, []);
                        }
                        
           
                        
                    }
                    else
                    {
                        acc[v.value] = []
                    }
                  
                    return acc;
                  }, {})
            }
        )
    }, [HeaderList])

 
    
    useEffect(() => {
        if( RowSelect !== null)
        {
            setTransferDataRow(() => ([possibleValuesByHeaders[RowSelect], [{value: '', label: "Empty value"}]]) )
            setcurrentMaxSize((prev) => ({...prev, MaxRows: Math.min(possibleValuesByHeaders[RowSelect].length, currentMaxSize.MaxRows)}))

        }

    }, [RowSelect])

    useEffect(() => {
        if( ColSelect !== null)
        {
            setTransferDataCol(() => ([possibleValuesByHeaders[ColSelect], [{value: '', label: "Empty value"}]]) )
            // setcurrentMaxSize((prev) => ({...prev, MaxCols: Math.min(possibleValuesByHeaders[ColSelect].length, currentMaxSize.MaxCols)}))
        }

    }, [ColSelect])

    useEffect(() => {
        setcurrentMaxSize((prev) => ({...prev, MaxCols: Math.min(transferdataCol[0].length, MAX_SIZE_COLS)}))
    }, [transferdataCol])

    useEffect(() => {
        setcurrentMaxSize((prev) => ({...prev, MaxRows: Math.min(transferdataRow[0].length, MAX_SIZE_ROWS)}))
    }, [transferdataRow])
    
    
  return (
    <>
    <Group>

        <Select
            value={RowSelect}
            onChange={(e) => {
                if(e)
                {
                    setcurrentMaxSize(prev => ({...prev, MaxRows: MAX_SIZE_ROWS}))
                    setRowSelect(e)
                }
            }}
            label={"Header for rows"}
            data={HeaderList}
        />
        {RowSelect && <TransferList
            value={transferdataRow}
            onChange={setTransferDataRow}
            searchPlaceholder="Search..."
            nothingFound="Nothing here"
            titles={['To be Counted', 'Exculded']}
            breakpoint="sm"
        />}
        
    </Group>
    <Group>

        <Select 
            defaultValue={ColSelect}
            onChange={(e) => {
                if(e)
                {
                    setcurrentMaxSize((prev) => ({...prev, MaxCols: MAX_SIZE_COLS}))
                    setColSelect(e)
                }
            }}
            label={"Header for columns"}
            data={HeaderList}
        />            
       {ColSelect && <TransferList
            value={transferdataCol}
            onChange={setTransferDataCol}
            searchPlaceholder="Search..."
            nothingFound="Nothing here"
            titles={['Shown', 'Hidden']}
            breakpoint="sm"
            />}
    </Group>
            <NumberInput className='w-1/6 lg:w-1/12' label={"Max size rows"} value={currentMaxSize.MaxRows} max={Math.min(MAX_SIZE_ROWS,transferdataRow[0].length) } min={1}  onChange={(e) => setcurrentMaxSize((prev) => ({...prev, MaxRows: e as number}))}/>
            <NumberInput className='w-1/6 lg:w-1/12' label={"Max size cols "} value={currentMaxSize.MaxCols}  max={Math.min(MAX_SIZE_COLS,transferdataCol[0].length) } min={1}  onChange={(e) => setcurrentMaxSize((prev) => ({...prev, MaxCols: e as number}))}/>
           <TextInput label={"Title"} value={tableTitle} onChange={(e) => setTableTitle(e.target.value)} />
    <div>Preview: </div>
        <SimpleStatTable rows={transferdataRow} cols={transferdataCol}  maxSize={currentMaxSize}  title='' />
        <Center>
                <Button color='green' variant='filled' onClick={() => {

                    const counts = getCountsFor2Headers([RowSelect as string, ColSelect as string], [ transferdataRow[0],transferdataCol[0] ])

                    addSimpleStatTable({cols: transferdataCol, rows: transferdataRow, dataCounts: counts, maxSize: currentMaxSize, title: tableTitle})
                }} >Add Table</Button>
        </Center>
    </>
  )
}

export default SimpleStatTableForm