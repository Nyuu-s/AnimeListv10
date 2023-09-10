import { Affix, Button, ScrollArea, Select, TextInput, rem } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconButton, SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialHandler, Typography } from "@material-tailwind/react"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { dialog } from "@tauri-apps/api"
import { useEffect, useState } from "react"
import { FaSave } from "react-icons/fa"
import { MdCancel, MdEdit } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useDataState } from "../context"
import { useAppState } from "../context/AppContext"
import { RecordNoID, Records, T_RecordNoID, useCastTo } from "./Helpers/useRecord"

type DetailsType = {
    id: string,
    data: Records
}
interface DetailsProps {
    details: DetailsType
}

function DetailsInfo({details}: DetailsProps) {
 const [EditMode, setEditMode] = useState<boolean>(false)
 const [currentRecord, setCurrentRecord] = useState<RecordNoID | undefined>(undefined)
 const [inputs, setInputs] = useState<T_RecordNoID | undefined>(undefined)

 const {opened} = useAppState().navState;
 const navigate = useNavigate()

 const {removeRecords,setData, saveData, restrictedValues} = useDataState();

 useEffect(() => {
    const allData = details.data;
    if(allData != undefined)
    {
      const record = new RecordNoID(useCastTo<T_RecordNoID>(allData[details.id]))
      setCurrentRecord(record);
      setInputs({...record.getRecord()})
    }
    else
    {
      setCurrentRecord(undefined)
    }
}, [details.data])

 const handleSubmit = (event: any) => {
    event.preventDefault()
    const recordID = details.id
    console.log(inputs);
    if(inputs){
      currentRecord?.setRecord(inputs)
      setData({...details.data, [recordID]: {...inputs, ID: recordID}, })
      saveData(0);
    }

    
    setEditMode(false)
  }

  const handleChange = (event:any) => {
    const name = event.target.name;
    const value = event.target.value;
    const defaults = inputs as T_RecordNoID

    
    if(event.target.id == 'url')
      setInputs(values => ({...values, [name]: {url:value, value: defaults[name].value}}))
    else
      setInputs(values => ({...values, [name]: {url:defaults[name].url, value }}))

  }

  const handleDelete = async () => {
    try {
      let isdelete = await dialog.ask("Are you sure you want to delete this record from the table ?", {type: "warning"})
      if(isdelete)
      {
        navigate('/list')
        toast.warn('Record deleted', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        removeRecords([details.id])
      }
    } catch (error) {
      toast.error('Something went wrong! No record deleted.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    }

  }

    
  const handleCancel = () => {
    setInputs({...currentRecord?.getRecord()})
    setEditMode(false)
  }

 const labelProps = {
    variant: "small",
    color: "blue-gray",
    className:
      "absolute transform  top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal",
  };

const matches = useMediaQuery('(min-width: 768px)');
  return (
    <>
         { matches && 
      <section id="image" className="col-span-2">
        <div className="flex flex-col justify-center items-center w-full ">
                    <img src="https://picsum.photos/200/300" className="w-1/2" alt="" />

        </div>
      </section>
      }

    { !EditMode ?     
      <section id="fields" className="col-span-5 col-start-2 md:col-span-3  " style={{height: 'calc(100vh - (var(--mantine-header-height, 0px) + 3rem))'}}>
          <ScrollArea className="h-full" >
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-2  gap-y-10 select-none ">
                {currentRecord && currentRecord.map((data, header) => (
                  <li key={header} className="mt-1"><span className="font-bold"> {header}:</span> {data.value} </li>
                  ))}
            </ul>
          </ScrollArea>
      </section>
    :  
    <section id="fields" className=" col-span-5 md:col-span-2" style={{height: 'calc(100vh - (var(--mantine-header-height, 0px) + 3rem))'}}>
        <ScrollArea className="h-full" >
            <form id="editform" >
                <label htmlFor="fun">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-2  gap-y-16 select-none pr-10 ">
                {currentRecord && currentRecord.map((data, header) => (
                  <li key={header} className=" pb-5"><span className="font-bold"> {header}:</span> 
                  {
                    restrictedValues[header] ? <Select id="value" clearable onChange={handleChange} defaultValue={data.value.toLowerCase()} placeholder='Pick one' data={restrictedValues[header].sort().map((v) => ({value: v.toLowerCase(), label: v}))                  }/>:
                    <TextInput id="value" name={header} onChange={handleChange} placeholder="Value" defaultValue={data.value} /> 
                  }
                    
                    <TextInput id="url" name={header}  className="mt-2" onChange={handleChange} placeholder="URL" defaultValue={data.url} /> 
                  </li>
                  ))}
                  <li className="text-center">
                    <Button className="" onClick={handleSubmit} variant="outline" color="green">SAVE</Button>
                  </li>
                  <li className="text-center">

                    <Button className="" onClick={handleCancel} variant="outline" color="red">CANCEL</Button>
                  </li>
              </ul>

                  </label>
                <div className="flex justify-around mb-10">

                </div>
             
            </form>
        </ScrollArea>

    </section>
    
    }



        <Affix hidden={opened && !matches}  position={{ bottom: rem(40), right: rem(40) }}>
          <SpeedDial >
            <SpeedDialHandler>
              <IconButton size="lg" className="rounded-full md:h-16 md:w-16   ">
                <IconPlus className="md:h-10 md:w-10 h-5 w-5 transform transition-transform group-hover:rotate-45 " />
              </IconButton>
            </SpeedDialHandler>
            <SpeedDialContent>
            { EditMode && <> 
            <SpeedDialAction  className="relative mb-3 md:mb-7" >
                  <FaSave className=" md:h-10 md:w-10 h-7 w-7 text-green-500" onClick={handleSubmit} />
                  <Typography {...labelProps}>Save</Typography>
            </SpeedDialAction>
            <SpeedDialAction  className="relative mb-3 md:mb-7" >
                  <MdCancel className=" md:h-10 md:w-10 h-7 w-7 text-red-500" onClick={handleCancel} />
                  <Typography {...labelProps}>Cancel</Typography>
            </SpeedDialAction></>}

              <SpeedDialAction  className="relative mb-3 md:mb-7" >
                <MdEdit className=" md:h-10 md:w-10 h-7 w-7 text-black" onClick={() => setEditMode(true)} />
                <Typography {...labelProps}>Edit</Typography>
              </SpeedDialAction>
              <SpeedDialAction  className="relative mb-3 md:mb-7" >
                <IconTrash className=" md:h-10 md:w-10 h-7 w-7 text-red-500" onClick={handleDelete} />
                <Typography {...labelProps}>Delete</Typography>
              </SpeedDialAction>
            </SpeedDialContent>
          </SpeedDial>
        </Affix>
    </>
  )
}

export default DetailsInfo