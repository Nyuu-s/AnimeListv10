
import { Divider, Navbar } from "@mantine/core";
// import Link from "next/link";
import CustomNavLink from "./Helpers/CustomNavLink";

import { useAppState } from '../context/AppContext';

export default function Demo() {


  const { opened } = useAppState().navState;

  return (
          
  <div className=' left-2 top-0'>


      {opened && <Navbar mt={26} height='100%' fixed={false}  width={{ sm:300, lg:400 }} p='xs' hiddenBreakpoint='sm' >
        <Navbar.Section mt="xs">{
          <>
          
            <div className='flex'>
              <h1 className='text-center w-full'>  AnimeList</h1>
         
            </div>
            <Divider mt={10} />
          </>

          
        }</Navbar.Section>

        <Navbar.Section >
         <div className="flex flex-col content-evenly">
         
            <CustomNavLink  path={"/"} display={"Home"} />
            <CustomNavLink  path={"/list"} display={"List"} />
          

         
          
         </div>
        </Navbar.Section>
      </Navbar>}
  
      </div>
  );
}