
import { Button } from '@mantine/core';

type Custom404Props = {};

const Custom404: React.FC<Custom404Props> = () => {


  return (

    <>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}} className='relative '>
      <img src="/icon3.png" alt="ds" className='absolute top-0 z-0'  />
      <div className='absolute left-auto top-0 z-10 text-center text-white mt-52' >
        <h1 style={{ fontSize: '4rem', margin: '2rem 0', textShadow: "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black" }} >404</h1>
        
        <h2 style={{ fontSize: '2rem', margin: '2rem 0' , textShadow: "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black"}}>Page Not Found</h2>
        <p style={{ fontSize: '1.5rem', margin: '2rem 0', textShadow: "-1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black" }}>
          The page you are looking for does not exist.
        </p>

        {/* <Link href="/"> */}
          <Button variant="light" size="lg">Go Back Home</Button>
        {/* </Link> */}
      </div>
    </div>

    </>
  );
};

export default Custom404;
