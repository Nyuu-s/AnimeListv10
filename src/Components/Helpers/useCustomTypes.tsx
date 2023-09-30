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

