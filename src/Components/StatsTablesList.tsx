import { ActionIcon, Group, Switch, Table } from '@mantine/core'
import React, { ChangeEvent } from 'react'
import { useDataState } from '../context'
import { IconAdjustments, IconAdjustmentsExclamation, IconTrash } from '@tabler/icons-react'
import { SimpleTableData } from './Helpers/useCustomTypes'

interface listProps {
  setEditData(data: SimpleTableData): void,
  setFormState(value:boolean): void
}
function StatsTablesList({setEditData, setFormState}:listProps) {
  const {SimpleStatTablesData, editSimpleStatTable, deleteSimpleStatTable} = useDataState()

  function handleVisibility(event: ChangeEvent<HTMLInputElement>, id:number ) {

    let edit = SimpleStatTablesData.find((v) => v.id == id)
    if(edit)
    {
      edit.visibility = event.target.checked
      editSimpleStatTable(id, edit)

    }
  }
  return (
    <Table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Table Name</td>
          <td>Visibility</td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        {SimpleStatTablesData.map((v) => (
          <tr>
            <td>{v.id}</td>
            <td>{v.title}</td>
            <td><Switch color='indigo' checked={v.visibility}  onChange={(e) => handleVisibility(e, v.id)}/></td>
            <td>
              <Group>
                <ActionIcon variant='filled' color='indigo' onClick={() => {
                  setEditData(v)
                  setFormState(true)
                  }}>
                  <IconAdjustments />
                </ActionIcon>
                <ActionIcon variant='filled' color='red' onClick={() => deleteSimpleStatTable(v.id)}>
                  <IconTrash />
                </ActionIcon>
              </Group>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

  )
}

export default StatsTablesList