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
    props.tableOption.isSticky ? "sticky top-0 bg-black" : ""

  return (
    <Table highlightOnHover verticalSpacing={props.spacingOptions.verticalSpacing} fontSize={props.spacingOptions.fontSize}>
        
        <thead>
        <tr className={`${Options} `}>
            <th>ID</th>
            {props.dataHeaders.map((header) => (
            <th key={header}>{header}</th>
            ))}
        </tr>
        </thead>
        <tbody>
        {Object.entries(props.data).map(([key, value], index) =>{ 
            return (
            <tr key={key}>
                <td>{index}</td>
                {props.dataHeaders.map((header, i) => (
                <td key={i}>{value[header]?.value}</td>
                ))}
            </tr>   
            )})
        }
        </tbody>
    </Table>
  )
}

export default AnimesTable