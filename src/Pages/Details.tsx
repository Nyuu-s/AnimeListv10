
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDataState } from "../context"
import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Typography,
} from "@material-tailwind/react";



import { useCastToAnimeNoID, T_AnimeNoID, AnimeNoID  as Anime, useCastTo} from "../Components/Helpers/useAnime"
import { Affix, Button, ScrollArea, TextInput, rem } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { MdCancel, MdEdit } from "react-icons/md";
import { useAppState } from "../context/AppContext";
import { FaCross, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import { dialog } from "@tauri-apps/api";






function Details() {

  const {id} = useParams<{id: string}>()
  const navigate = useNavigate()
  const {getData, removeRecords,setData, saveData} = useDataState()
  const [currentAnime, setCurrentAnime] = useState<Anime | undefined>(undefined)

  const [inputs, setInputs] = useState<T_AnimeNoID | undefined>(undefined)
  const [EditMode, setEditMode] = useState<boolean>(false)
  const matches = useMediaQuery('(min-width: 768px)');
  const {opened} = useAppState().navState;
  const labelProps = {
    variant: "small",
    color: "blue-gray",
    className:
      "absolute transform  top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal",
  };
  const handleSubmit = (event: any) => {
    event.preventDefault()
    const animeID = id as string
    console.log(inputs);
    if(inputs){
      currentAnime?.setAnime(inputs)
      setData({...getData(), [animeID]: {...inputs, ID: animeID}, })
      saveData();
    }
    console.log(getData());
    
    setEditMode(false)
  }
  
  const handleCancel = () => {
    setInputs({...currentAnime?.getAnime()})
    setEditMode(false)
  }

  const handleChange = (event:any) => {
    const name = event.target.name;
    const value = event.target.value;
    const defaults = inputs as T_AnimeNoID

    
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
        removeRecords([id as string])
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


  useEffect(() => {
      const allData = getData();
      const anime = new Anime(useCastTo<T_AnimeNoID>(allData[id as string]))
      setCurrentAnime(anime);

      setInputs({...anime.getAnime()})
   
  }, [getData()])


  return ( // return a list ul
    <div className="grid grid-cols-5   gap-0 h-full">
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
                {currentAnime && currentAnime.map((data, header) => (
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
                {currentAnime && currentAnime.map((data, header) => (
                  <li key={header} className=" pb-5"><span className="font-bold"> {header}:</span> 
                    <TextInput id="value" name={header} onChange={handleChange} placeholder="Value" defaultValue={data.value} /> 
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
    </div>
  )

}

export default Details