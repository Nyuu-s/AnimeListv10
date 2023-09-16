import { Table, TransferListData } from "@mantine/core"


interface SimpleTableData 
{
    rows: TransferListData | string[],
    cols: TransferListData | string[]
    title: string,
    maxSize: {MaxRows: number, MaxCols: number}
}
function SimpleStatTable({rows, cols, title, maxSize}: SimpleTableData) {
    console.log(maxSize);
    
    if(typeof rows[0] === 'string' && typeof cols[0] === "string")
    {
        return (
            <Table title={title}>
               
                <tbody>
                    <tr>
                        <th></th>
                    {rows.slice(0, maxSize.MaxRows).map((v) => <th>
                      {v as string}
                        </th>)}
                    </tr>
        
                    {cols.slice(0, maxSize.MaxCols).map((v) => <tr>
                      <th>{v as string}</th>   
                      {cols.slice(0, maxSize.MaxRows).map(() => <td>{Math.round(Math.random()/0.1)}</td>)}
                        
                        
                        </tr>)}
                    
                
              
                </tbody>
            </Table>
          )
    }
    else if (typeof rows[0] === 'object' && typeof cols[0] === "object")
    {
        return (
            <Table title={title}>
               
                <tbody>
                    <tr>
                        <th></th>
                    {cols[0].slice(0, maxSize.MaxCols).map((v) => <th>
                      {v.label}
                        </th>)}
                    </tr>
        
                    {rows[0].slice(0, maxSize.MaxRows).map((v) => <tr>
                      <th>{v.label}</th>   
                      {typeof cols[0] === 'object' && cols[0].slice(0, maxSize.MaxCols).map(() => <td>{Math.round(Math.random()/0.1)}</td>)}
                        
                        
                        </tr>)}
                    
                
              
                </tbody>
            </Table>
          )
    }

}

export default SimpleStatTable