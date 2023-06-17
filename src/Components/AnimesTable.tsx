import {Table } from "@mantine/core";

type TableOption = {
    isSticky: boolean,
}
interface DataProps {
    dataHeaders: string[],
    data: object,
    tableOption: TableOption

}

function AnimesTable(props: DataProps) {
 const Options = 
    props.tableOption.isSticky ? "sticky top-0 bg-black" : ""

  return (
    <Table highlightOnHover>
      
        <thead>
        <tr className={`${Options} `}>
            <th>ID</th>
            {props.dataHeaders.map((header) => (
            <th>{header}</th>
            ))}
        </tr>
        </thead>
        <tbody>
        {Object.entries(props.data).map(([key, value], index) =>{ 
            return (
            <tr key={key}>
                <td>{index}</td>
                {props.dataHeaders.map((header) => (
                <td>{value[header]?.value}</td>
                ))}
            </tr>   
            )})
        }
        </tbody>
    </Table>
  )
}

export default AnimesTable