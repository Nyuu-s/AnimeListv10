

import { Divider} from "@mantine/core";

import { useMediaQuery } from '@mantine/hooks';
import { useAppState } from "../../context/AppContext";
import { useNavigate   } from "react-router-dom";


interface CustomNavLinkProps {
    path: string;
    display: string;
  
  }

function CustomNavLink({path, display}: CustomNavLinkProps) {
    const navigate = useNavigate ();
    const { close } = useAppState().navState;
    const matches = useMediaQuery('(min-width: 48em)');
    console.log(path);
    

  return ( 
  <div className=" pt-5 rounded-lg cursor-pointer hover:bg-gray-600 " onClick={() => {
      matches ? "" : close() 
      navigate(path);
      
    }}>
      <h2 className="ml-5 text-lg"> {display} </h2>
      <Divider className="mt-5"/>
  </div>
  )
}

export default CustomNavLink