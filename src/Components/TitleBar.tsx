
import { useNavState } from '../context/AppContext';
import { Header, Burger } from '@mantine/core'

function TitleBar() {
const {opened, toggle} = useNavState();

  return (
    <Header height={60} mt={26} className='fixed z-50' p="xs">
        <Burger opened={opened} onClick={toggle} />
    </Header>  
  )
}

export default TitleBar