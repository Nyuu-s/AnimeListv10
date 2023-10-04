import { Button, Center, Select, TextInput } from "@mantine/core"
import { useDataState } from "../context"
import { useEffect, useState } from "react"
import { ChartType } from "./Helpers/useCustomTypes"

function ChartForm() {
    const {SimpleStatTablesData, chartsCollection, addChart} = useDataState()
    const [SelectTable, setSelectTable] = useState<string | undefined>(undefined)
    const [SelectColumn, setSelectColumn] = useState<string | undefined>(undefined)
    const [isSColumnDisabled, setisSColumnDisabled] = useState<boolean>(false)
    const [isSTableDisabled, setisSTableDisabled] = useState<boolean>(false)



    useEffect(() => {
      setisSColumnDisabled(SelectColumn !== undefined)
      setisSTableDisabled(SelectTable !== undefined)
    }, [SelectTable, SelectColumn])
    

  return (
    <div className="mt-5">
       <TextInput className='text-center w-1/2 mx-auto my-5' label={"Title"} value={""}  />
        <Select
        label={"Chart Type"}
        defaultValue={'Donut'} 
        data={[
            'Donut',
            'Pie',
            'Lines'
            ]}/>
        
        <Select
        disabled={isSColumnDisabled }
        value={SelectTable}
        onChange={(e) => setSelectTable(e as string)}
        label={ <div className={`${ isSColumnDisabled || SimpleStatTablesData.length > 0 ?  '' :'text-gray-700' }`}>Table </div>  }
        data={[...SimpleStatTablesData.map((v) => ({label: `${v.id} - ${v.title} `, value: `${v.id}`}) )]} />

        <Select
        value={SelectColumn}
        onChange={(e) => setSelectColumn(e as string)}
        disabled={isSTableDisabled}
        label={<div className={`${isSTableDisabled ? 'text-gray-700': ''}`}>Column </div>}
        data={["Column1", "Column2"]} />
         <Center className='mt-5'>
          
            <Button className="mr-5" variant="filled" color="green" onClick={() => {
               const ID =  chartsCollection.length > 0 ? chartsCollection.sort((a, b) => a.id > b.id ? 1 : -1)[chartsCollection.length-1].id+1 : 0
               const addingChart = {id: ID,  visibility: true, title: "tableTitle", type: ChartType.CDonut, data: []}
              
              addChart(addingChart)
            }}>Add Chart</Button>
            <Button variant="filled" color="yellow">Cancel</Button>
         </Center>
    </div>
  )
}

export default ChartForm