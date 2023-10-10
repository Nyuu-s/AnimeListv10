import { Button, Center, Select, TextInput, TransferListItem } from "@mantine/core"
import { useDataState } from "../context"
import { useEffect, useState } from "react"
import { ChartData, ChartType, DatasetChart, SimpleTableData } from "./Helpers/useCustomTypes"

const clamp = (num:number, min:number, max: number) => Math.min(Math.max(num, min), max);
function GetChartDataForCartesianProd(Table: SimpleTableData, ID: number, visibility: boolean, title: string, chartType: ChartType, tooltip: string): ChartData {
  const rows = Table.rows[0]
  const max = Table.maxSize
  const cols = Table.cols[0]
  let out: ChartData = {datasets: [], id: ID, labels: [], title: title,  type: chartType, visibility: visibility}

  if (typeof rows[0] === 'object' && typeof cols[0] === "object")
  {
    const SlicedRows = (rows as TransferListItem[]).slice(0, max.MaxRows)
    const SlicedCols = (cols as TransferListItem[]).slice(0, max.MaxCols)
    const bgColors: string[] = []
    const bgBorderColor: string[] = []
    let labels = SlicedRows.flatMap((rowLabel, i) => {
      
      return SlicedCols.filter((_, j) => { 
        return Table.dataCounts[i][j] !=0     
      }).map((colLabel) => {
        const r = clamp(Math.round(Math.random() * 255), 25, 255)
        const g = clamp(Math.round(Math.random() * 255), 25, 255)
        const b = clamp(Math.round(Math.random() * 255), 25, 255)
        bgColors.push(`rgba(${r}, ${g}, ${b}, 0.2)`)
        bgBorderColor.push(`rgba(${r}, ${g}, ${b}, 1)`)

        return(
          `${colLabel.label} - ${rowLabel.label}`
        )
      } )
    })
    out.labels = labels

    const dataCounts = Table.dataCounts.slice(0, max.MaxRows).map(arr => arr.slice(0, max.MaxCols)).flat().filter((num) => num !== 0)

    out.datasets.push({data: dataCounts, backgroundColor: bgColors, borderColor: bgBorderColor, borderWidth: 1, label: tooltip})
    // out.datasets.push({data: dataCounts, backgroundColor: bgColors, borderColor: bgBorderColor, borderWidth: 1, label: "twice"})
    console.log(out);
    
  }
  return out
}

function GetLabelsForCol(TablesCollection: SimpleTableData[], TableID: number): string[] {
  const cols = TablesCollection[TableID].cols[0]
  if (typeof cols[0] === 'object')
  {
     return (cols as TransferListItem[]).map((colLabel) => {
      return colLabel.label
    })
  }
  return []
}

function GetLabelsForRow(TablesCollection: SimpleTableData[], TableID: number): string[] {
  const rows = TablesCollection[TableID].rows[0]
  if (typeof rows[0] === 'object')
  {
     return (rows as TransferListItem[]).map((rowLabel) => {
      return rowLabel.label
    })
  }
  return []
}

type chartmap = {
  [key: string]: ChartType
}

function ChartForm() {
  const ChartTypeMap: chartmap = {
    "Doughnut": ChartType.CDonut,
    "Pie": ChartType.CPie,
    "Lines": ChartType.CLine
  }
    const {SimpleStatTablesData, chartsCollection, addChart} = useDataState()
    const [ChartTitle, setChartTitle] = useState<string>()
    const [SelectChartType, setSelectChartType] = useState<string>(Object.keys(ChartTypeMap)[0])
    const [SelectOverlayLabel, setSelectOverlayLabel] = useState<string>()
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
       <TextInput className='text-center w-1/2 mx-auto my-5' label={"Title"} value={ChartTitle} onChange={(e) => setChartTitle(e.target.value)}  />
       <TextInput className='text-center w-1/2 mx-auto my-5' label={"Overlay Label"} value={SelectOverlayLabel} onChange={(e) => setSelectOverlayLabel(e.target.value)}  />
        <Select
        label={"Chart Type"}
        onChange={(e) => setSelectChartType(e as string)}
        defaultValue={SelectChartType} 
        data={Object.keys(ChartTypeMap)}/>
        
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
               const datasetsArray: DatasetChart = {
                label: SelectOverlayLabel as string,
                data: SimpleStatTablesData[parseInt(SelectTable as string)].dataCounts.slice(0, SimpleStatTablesData[parseInt(SelectTable as string)].maxSize.MaxRows).map(arr => arr.slice(0, SimpleStatTablesData[parseInt(SelectTable as string)].maxSize.MaxCols)).flat(),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.4)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1
               }
               const cartesianProd: ChartData = GetChartDataForCartesianProd(SimpleStatTablesData[parseInt(SelectTable as string)], ID, true, ChartTitle as string, ChartTypeMap[SelectChartType], SelectOverlayLabel as string )
               const rowlabels = GetLabelsForRow(SimpleStatTablesData, parseInt(SelectTable as string))
               const collabels = GetLabelsForCol(SimpleStatTablesData, parseInt(SelectTable as string))
               const addingChart: ChartData = cartesianProd
              
              addChart(addingChart)
            }}>Add Chart</Button>
            <Button variant="filled" color="yellow">Cancel</Button>
         </Center>
    </div>
  )
}

export default ChartForm