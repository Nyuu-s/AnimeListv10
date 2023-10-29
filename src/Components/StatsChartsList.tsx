import { ActionIcon, Center, Group, Switch, Table } from '@mantine/core'
import React, { ChangeEvent } from 'react'
import { useDataState } from '../context'
import { IconAdjustments, IconAdjustmentsExclamation, IconTrash } from '@tabler/icons-react'
import { ChartData, SimpleTableData } from './Helpers/useCustomTypes'

interface listProps {
  setEditData(data: ChartData): void,
  setFormState(value:boolean): void
}
function StatsChartsList({setEditData, setFormState}:listProps) {
  const {chartsCollection, editChart, deleteChart} = useDataState()

  function handleVisibility(event: ChangeEvent<HTMLInputElement>, id:number ) {

    let edit = chartsCollection.find((v) => v.id == id)
    if(edit)
    {
      edit.visibility = event.target.checked
      editChart(id, edit)

    }
  }
  if(chartsCollection.length > 0)
  {
    return (
      <Table striped >
        <thead>
          <tr className='text-center font-bold'>
            <td>ID</td>
            <td>Chart Name</td>
            <td>Visibility</td>
            <td>Edit</td>
            <td>Delete</td>
          </tr>
        </thead>
        <tbody>
          {chartsCollection.map((v, i) => (
            <tr key={i}> 
              <td><Center>{v.id}</Center></td>
              <td><Center>{v.title}</Center></td>
              <td><Center><Switch color='indigo' checked={v.visibility}  onChange={(e) => handleVisibility(e, v.id)}/></Center></td>
              <td>
              <Center>
                  <Group>
                    <ActionIcon variant='filled' color='indigo' onClick={() => {
                      setEditData(v)
                      setFormState(true)
                      }}>
                      <IconAdjustments />
                    </ActionIcon>

                  </Group>
                </Center>
              </td>
              <td>
                <Center>
                  <ActionIcon variant='filled' color='red' onClick={() => deleteChart(v.id)}>
                    <IconTrash />
                  </ActionIcon>
                </Center>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
  
    )
  }

  return <></>
 
}

export default StatsChartsList