import {Table } from "@mantine/core";

type TableOption = {
    isSticky: boolean,
}

type TableSpacing = {
    verticalSpacing: string,
    fontSize: string
}
interface DataProps {
    dataHeaders: string[],
    data: object,
    tableOption: TableOption,
    spacingOptions: TableSpacing
}

function AnimesTable(props: DataProps) {
 const Options = 
    props.tableOption.isSticky ? "text-red-500 sticky top-0 bg-black" : ""

  return (
    <Table striped highlightOnHover verticalSpacing={props.spacingOptions.verticalSpacing} fontSize={props.spacingOptions.fontSize}>
        
        <thead>
        <tr className={`${Options}  `}>
            <th>ID</th>
            {props.dataHeaders.map((header) => (
            <th  key={header}>{header}</th>
            ))}
        </tr>
        </thead>
        <tbody>
        {Object.entries(props.data).map(([key, value], index) =>{ 
            
            return (
            <tr key={key}>
                <td>{index}</td>
                {props.dataHeaders.map((header, i) => {
                    if(value[header] && value[header].url != "")
                    {
                        return(<td key={i} className="cursor-pointer hover:text-blue-500 hover:underline" onClick={()=> console.log("Invoke open in browser comand",value[header].url )}>{value[header]?.value}</td>)
                    }
                    return(<td key={i} >{value[header]?.value}</td>)
        })}
            </tr>   
            )})
        }
        </tbody>
    </Table>
  )
}

export default AnimesTable