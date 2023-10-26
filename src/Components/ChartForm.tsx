import { Button, Center, Select, TextInput, TransferListItem } from "@mantine/core"
import { useDataState } from "../context"
import { useEffect, useMemo, useState } from "react"
import { ChartData, ChartType, DatasetChart, SimpleTableData } from "./Helpers/useCustomTypes"
import { RecordNoID, T_RecordNoID } from "./Helpers/useRecord";
import { title } from "process";

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
interface editProps {
  editData: ChartData | undefined
  setFormState(value:boolean): void
}
function ChartForm({editData, setFormState}: editProps) {
  const ChartTypeMap: chartmap = {
    "Doughnut": ChartType.CDonut,
    "Pie": ChartType.CPie,
    "Lines": ChartType.CLine
  }
   console.log(editData)
    const editMode = editData != undefined
    const {SimpleStatTablesData, chartsCollection, addChart, getHeaders, getPossibleValues, getData, editChart} = useDataState()
    const [ChartTitle, setChartTitle] = useState<string>(editData ? editData.title : '')
    const [SelectChartType, setSelectChartType] = useState<string>( editData ? Object.keys(ChartTypeMap).find((key) => ChartTypeMap[key] === editData.type) as string : Object.keys(ChartTypeMap)[0])
    const [SelectOverlayLabel, setSelectOverlayLabel] = useState<string>(editData ? editData.datasets[0].label : '')
    const [SelectTable, setSelectTable] = useState<string | undefined>(editData  ? editData.fromTable ?? undefined : undefined)
    const [SelectColumn, setSelectColumn] = useState<string | undefined>(editData  ? editData.fromColumn ?? undefined : undefined)
    const [isSColumnDisabled, setisSColumnDisabled] = useState<boolean>(false)
    const [isSTableDisabled, setisSTableDisabled] = useState<boolean>(false)

    const HeaderList = useMemo(() => getHeaders().map((v) => ({value: v.header, label: v.header})).sort((a, b) =>  (a.label > b.label)  ? 1 : -1), [])


    useEffect(() => {
      console.log(SelectColumn);
      
      setisSColumnDisabled(SelectColumn !== undefined && SelectColumn !== null )
      setisSTableDisabled(SelectTable !== undefined && SelectTable !== null )
    }, [SelectTable, SelectColumn])
    

  function getChartDataFromColumn(str: string) {
      const pValues = getPossibleValues(str)
      const data = Object.values(getData())

      
      const Restricted = data.reduce((acc: any, curr) => {
        const currNoID = curr as T_RecordNoID
        const currStr = currNoID[str]

        
        if(pValues.includes(`${currStr.value}`))
        {
          if(currStr.value === "")
          {
            const value = "Empty Value"
            acc[value] = acc[value] === undefined ? 1 : acc[value] += 1
          }
          else
          {
            acc[currStr.value] = acc[currStr.value] === undefined ? 1 : acc[currStr.value] += 1
          }
        }
      return acc
      }, {})

      

      

      return Restricted
  }

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
        clearable
        onChange={(e) => setSelectTable(e as string)}
        label={ <div className={`${ isSColumnDisabled || SimpleStatTablesData.length > 0 ?  '' :'text-gray-700' }`}>Table </div>  }
        data={[...SimpleStatTablesData.map((v) => ({label: `${v.id} - ${v.title} `, value: `${v.id}`}) )]} />

        <Select
        value={SelectColumn}
        clearable
        onChange={(e) => setSelectColumn(e as string)}
        disabled={isSTableDisabled}
        label={<div className={`${isSTableDisabled ? 'text-gray-700': ''}`}>Column </div>}
        data={HeaderList.filter((v) => v.label !== 'ID')} />
         <Center className='mt-5'>
          
            <Button className="mr-5" variant="filled" color={editMode ? "indigo":"green"} onClick={() => {
              let ID = editMode ? 
                editData.id 
                :
                chartsCollection.length > 0 ? chartsCollection.sort((a, b) => a.id > b.id ? 1 : -1)[chartsCollection.length-1].id+1 : 0
              
          

              //Table Mode
              if(!isSColumnDisabled && isSTableDisabled)
              {

                
                const cartesianProd: ChartData = GetChartDataForCartesianProd(SimpleStatTablesData[parseInt(SelectTable as string)], ID, true, ChartTitle as string, ChartTypeMap[SelectChartType], SelectOverlayLabel as string )
                const rowlabels = GetLabelsForRow(SimpleStatTablesData, parseInt(SelectTable as string))
                const collabels = GetLabelsForCol(SimpleStatTablesData, parseInt(SelectTable as string))
                const chartCreatedOrUpdated: ChartData = {...cartesianProd, fromTable: SelectTable}
                if(editMode)
                {
                  editChart(ID, chartCreatedOrUpdated)
                }
                else
                {
                  addChart(chartCreatedOrUpdated)
                }
               
              }
              else // Column Mode
              {
                  const chartData = getChartDataFromColumn(SelectColumn as string)
                  const labels = Object.keys(chartData)
                  const counts: number[] = Object.values(chartData)
                  const backgrounds :string[] = []
                  labels.forEach(_ => {
                    const r = clamp(Math.round(Math.random() * 255), 15, 255)
                    const g = clamp(Math.round(Math.random() * 255), 25, 255)
                    const b = clamp(Math.round(Math.random() * 255), 30, 255)
                    backgrounds.push(`rgba(${r}, ${g}, ${b}, 0.5)`)
                  })
                  const dataset: DatasetChart = 
                    {
                      data: counts,
                      backgroundColor: backgrounds,
                      borderColor: [],
                      borderWidth: 1,
                      label: "#"
                    }
                    const chartCreatedOrUpdated = {labels, id: ID, title: ChartTitle as string, visibility: true, type: ChartTypeMap[SelectChartType], datasets: [dataset], fromColumn: SelectColumn}
                    if(editMode)
                    {
                      editChart(ID, chartCreatedOrUpdated)
                    }
                    else
                    {
                      addChart(chartCreatedOrUpdated)
                    }
                  }
                  setFormState(false);
            }}>{editMode ? "Edit Chart":"Add Chart"}</Button>
            <Button variant="filled" color="yellow" onClick={() =>{
              setFormState(false);
            }}>Cancel</Button>
         </Center>
    </div>
  )
}

export default ChartForm