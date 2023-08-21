
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailsInfo from "../Components/DetailsInfo";
import { Records } from "../Components/Helpers/useRecord";
import { useDataState } from "../context";

function Details() {
  const [currentData, setCurrentData] = useState<undefined | Records>(undefined)
  const {id} = useParams<{id: string}>()
  const {getData} = useDataState();

  useEffect(() => {
    setCurrentData(getData())
  }, [getData()])
  
  return ( 
    <div className="grid grid-cols-5   gap-0 h-full">
      {currentData && <DetailsInfo details={{id: id as string, data: currentData}} />}
    </div>
  )

}

export default Details