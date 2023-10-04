import { TransferListData } from "@mantine/core"

export type SimpleTableData = {
    visibility: boolean
    rows: TransferListData | string[],
    cols: TransferListData | string[],
    headers: {col: string, row: string},
    dataCounts: number[][]
    id: number
    title: string,
    maxSize: {MaxRows: number, MaxCols: number}
  }

export enum ChartType {
  CLine,
  CPie,
  CDonut
}

type chartDataset = {
  label: string,
  data: number[],
  backgroundColor: string[],
  borderColor: string[]

}

export type ChartData = {
  visibility: boolean,
  type: ChartType,
  id: number,
  title: string
  data: chartDataset[]
}

