

import { Divider} from "@mantine/core";

import { useMediaQuery } from '@mantine/hooks';
import { useNavState } from "../../context/AuthContext";


interface CustomNavLinkProps {
    path: string;
    display: string;
  
  }

function CustomNavLink({path, display}: CustomNavLinkProps) {

    const { close } = useNavState();
    const matches = useMediaQuery('(min-width: 48em)');
    console.log(path);
    

  return ( 
  <div className=" pt-5 rounded-lg cursor-pointer hover:bg-gray-600 " onClick={() => {
      matches ? "" : close() 
      
      
    }}>
      <h2 className="ml-5 text-lg"> {display} </h2>
      <Divider className="mt-5"/>
  </div>
  )
}

export default CustomNavLink