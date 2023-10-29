import { Table, TransferListData } from "@mantine/core"



interface SimpleTableData 
{
    rows: TransferListData | string[],
    cols: TransferListData | string[]
    title: string,
    counts?: number[][]
    maxSize: {MaxRows: number, MaxCols: number}
}
function SimpleStatTable({rows, cols, counts, title, maxSize}: SimpleTableData) {

    
    if(typeof rows[0] === 'string' && typeof cols[0] === "string")
    {
        return (
            <Table withColumnBorders withBorder title={title}>
               
                <tbody>
                    <tr>
                        <th></th>
                    {rows.slice(0, maxSize.MaxRows).map((v) => <th>
                      {v as string}
                        </th>)}
                    </tr>
        
                    {cols.slice(0, maxSize.MaxCols).map((v, i) => <tr>
                      <th>{v as string}</th>   
                      {counts ? 
                        counts[i].slice(0, maxSize.MaxRows).map((count) => <td>{count}</td>) :
                        cols.slice(0, maxSize.MaxRows).map(() => <td>{ Math.round(Math.random()/0.1)}</td>)
                      }

                        
                        
                        </tr>)}
                    
                
              
                </tbody>
            </Table>
          )
    }
    else if (typeof rows[0] === 'object' && typeof cols[0] === "object")
    {
        return (
            <Table withColumnBorders withBorder title={title}>
               
                <tbody>
                    <tr>
                        <th> </th>
                    {cols[0].slice(0, maxSize.MaxCols).map((v, i) => <th key={i}>
                      {v.label}
                        </th>)}
                    </tr>
        
                    {
                      rows[0].slice(0, maxSize.MaxRows).map((v, i) => 
                        <tr key={i}> 
                          <th>{v.label}</th>   
                          {counts ?
                            counts[i].slice(0, maxSize.MaxCols).map((count, i) => <td key={i}>{count}</td>) :
                            typeof cols[0] === 'object' && cols[0].slice(0, maxSize.MaxCols).map((_,i) => <td key={i}>{Math.round(Math.random()/0.1)}</td>)
                          }                        
                        </tr>)
                    }
                    
                
              
                </tbody>
            </Table>
          )
    }

}

export default SimpleStatTable