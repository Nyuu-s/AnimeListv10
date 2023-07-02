import { Accordion, ActionIcon, Affix, Button, Center, Group, Portal, ScrollArea, rem } from "@mantine/core"
import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useDataState } from "../context/"
import { Icon3dCubeSphere, Icon3dRotate, IconAdjustments, IconArrowBadgeUp, IconEdit, IconEditOff, IconPlug, IconPlus, IconSettings } from "@tabler/icons-react"
import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction,
  Typography,
} from "@material-tailwind/react";


import { useAppState } from "../context/AppContext"
import { useMediaQuery } from "@mantine/hooks"
import { MdEdit, MdHome, MdSettings } from "react-icons/md"

type Anime = {
  headers: string[],
  elements: AnimeElement
}

type AnimeElement = {

  [key: string]:  { url: string; value: string };
}

function Details() {
  const { pathname} = useLocation()
  const param = useParams()
  const {getData, getHeaders} = useDataState()
  const [currentAnime, setCurrentAnime] = useState<Anime | undefined>(undefined)
  const {opened} = useAppState().navState;
  const matches = useMediaQuery('(min-width: 56.25em)');
  const labelProps = {
    variant: "small",
    color: "blue-gray",
    className:
      "absolute transform  top-2/4 -left-2/4 -translate-y-2/4 -translate-x-3/4 font-normal",
  };
  useEffect(() => {
    console.log(pathname, param);
    const headers = getHeaders()
    const value = Object.values(getData()).find((value) => value['ID'] == param['id']);
    
    setCurrentAnime({headers, elements: value })
    
    
  }, [])
  
  console.log(currentAnime?.elements[currentAnime.headers[1]]);
  return (
    <div className="grid grid-cols-5  gap-0 h-full">

  { matches && <section id="image">
        <div className="flex flex-col justify-center items-center w-full ">
                    <img src="https://picsum.photos/200/300" className="w-1/2" alt="" />
        </div>
      </section>}

      <section id="fields" className="col-span-5 md:col-span-2  h-full ">
      
        <div className="h-full ">
          <ScrollArea className="md:h-full h-80 " >
            <Center>
              <ul className="grid grid-cols-1 md:grid-cols-2  gap-y-16 select-none ">
                {currentAnime && Object.keys(currentAnime.elements).map((key) =>  {
                 if(key !== "ID")
                  {              
                    return (
                    <li className="">
                      <span className="font-bold">{key}</span>: {currentAnime.elements[key].value} 
                    </li>)
                  }
                  else
                  return ""
                })}
              </ul>            
            </Center>
          </ScrollArea>
                  
        </div>
        

      </section>
      
 
        <Affix hidden={opened && !matches}  position={{ bottom: rem(40), right: rem(40) }}>
 

        <SpeedDial>
          <SpeedDialHandler>
            <IconButton size="lg" className="rounded-full md:h-16 md:w-16  ">
              <IconPlus className="md:h-10 md:w-10 h-5 w-5 transform transition-transform group-hover:rotate-45" />
            </IconButton>
          </SpeedDialHandler>
          <SpeedDialContent>
            <SpeedDialAction className="relative">
              <MdEdit className=" md:h-10 md:w-10 h-5 w-5" />
              <Typography {...labelProps}>Edit</Typography>
            </SpeedDialAction>
          </SpeedDialContent>
        </SpeedDial>


        </Affix>


        {/* <img src="https://cdn.myanimelist.net/images/anime/2/35633.jpg" className="h-3/4" alt="" />
        <div className=" ">

          <ul className="mx-auto flex flex-row flex-wrap justify-items-start justify-around w-1/2 ">
              {currentAnime && Object.keys(currentAnime.elements).map((key) =>  {
                if(key !== "ID")
                {              
                  return (
                    <li className="mt-2"> 
                      <span className="font-bold">{key}</span>: {currentAnime.elements[key].value} 
                    </li>)
                }
                else
                return ""
              })}
          </ul>
        </div> */}

    </div>
  )
}

export default Details