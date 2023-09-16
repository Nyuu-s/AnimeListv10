import { Group, Select, Table, TransferList, TransferListData } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react';
import { useDataState } from '../context';

// const initialValues: TransferListData = [
//     [
//       { value: 'react', label: 'React' },
//       { value: 'ng', label: 'Angular' },
//       { value: 'next', label: 'Next.js' },
//       { value: 'blitz', label: 'Blitz.js' },
//       { value: 'gatsby', label: 'Gatsby.js' },
//       { value: 'vue', label: 'Vue' },
//       { value: 'jq', label: 'jQuery' },
//     ],
//     [
//       { value: 'sv', label: 'Svelte' },
//       { value: 'rw', label: 'Redwood' },
//       { value: 'np', label: 'NumPy' },
//       { value: 'dj', label: 'Django' },
//       { value: 'fl', label: 'Flask' },
//     ],
//   ];



function StatsTableSimple() {

    const [tableNbCol, setTableNbCol] = useState<number>(1);
    const {getHeaders, getPossibleValues, restrictedValues} = useDataState();
    const HeaderList = useMemo(() => getHeaders().map((v) => ({value: v.header, label: v.header})).sort((a, b) => a.label > b.label ? 1 : -1), [])

    

    const initialValues: TransferListData = [
        [],
        []
    ]  
    const [transferdataRow, setTransferDataRow] = useState<TransferListData>(initialValues);
    const [transferdataCol, setTransferDataCol] = useState<TransferListData>(initialValues);
    const [RowSelect, setRowSelect] = useState<null | string>(null);
    const [ColSelect, setColSelect] = useState<null | string>(null)

   const test = useMemo(() => {
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

    console.log(test);
    
    useEffect(() => {
        if( RowSelect !== null)
        {
            setTransferDataRow(() => ([test[RowSelect], [{value: '', label: "Empty value"}]]) )
        }

    }, [RowSelect])

    useEffect(() => {
        if( ColSelect !== null)
        {
            setTransferDataCol(() => ([test[ColSelect], [{value: '', label: "Empty value"}]]) )
        }

    }, [ColSelect])
    
  return (
    <>
    <Group>

        <Select
            value={RowSelect}
            onChange={(e) => setRowSelect(e)}
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
            onChange={(e) => setColSelect(e)}
            label={"Header for Columns"}
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
    <div>Preview: </div>
    <Table>
       
        <tbody>
            <tr>
                <th></th>
            {transferdataRow[0].slice(0, 5).map((v) => <th>
              {v.label}
                </th>)}
            </tr>

            {transferdataCol[0].slice(0, 5).map((v) => <tr>
              <th>{v.label}</th>   
              {transferdataRow[0].slice(0, 5).map(() => <td>{Math.round(Math.random()/0.1)}</td>)}
                
                
                </tr>)}
            
        
      
        </tbody>
    </Table>
    </>
  )
}

export default StatsTableSimple