import { Accordion, Center, Group, ScrollArea } from "@mantine/core"
import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useDataState } from "../context/"

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

  useEffect(() => {
    console.log(pathname, param);
    const headers = getHeaders()
    const value = Object.values(getData()).find((value) => value['ID'] == param['id']);
    
    setCurrentAnime({headers, elements: value })
    
    
  }, [])
  
  console.log(currentAnime?.elements[currentAnime.headers[1]]);
  return (
    <div className="grid grid-cols-2 w-full h-screen">
      <section className="hidden sm:block">
        <div className="flex flex-col justify-center items-center w-full ">
                    <img src="https://picsum.photos/200/300" className="w-1/2" alt="" />
        </div>
      </section>
      <section className="  flex-row justify-start  w-full">
      
        <div>
      
        <ScrollArea className="sm:h-80 h-full" >

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-10 ">
                {currentAnime && Object.keys(currentAnime.elements).map((key) =>  {
                  if(key !== "ID")
                  {              
                    return (
                      <li >
                          <span className="font-bold">{key}</span>: {currentAnime.elements[key].value} 
                      </li>)
                  }
                  else
                  return ""
                })}
            </ul>
              
                </ScrollArea>
                
          </div>
       

      </section>
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