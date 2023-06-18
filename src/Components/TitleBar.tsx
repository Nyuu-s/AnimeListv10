
import { IconMessageCircle, IconUserShield, IconSettings } from '@tabler/icons-react';
import { useNavState } from '../context/AppContext';
import { Header, Burger, Tabs, Group } from '@mantine/core'

function TitleBar() {
const {opened, toggle} = useNavState();

  return (
    <Header height={60} mt={26} className='fixed z-50' p="xs">
      <Group>

          <Burger opened={opened} onClick={toggle} className='mt-1'/>
          <Tabs defaultValue="gallery" className='mx-10 bottom-0 right-0 absolute'>
          <Tabs.List>
            <Tabs.Tab value="gallery" icon={<IconUserShield size="0.8rem" />}>User Settings</Tabs.Tab>
            <Tabs.Tab value="settings" icon={<IconSettings size="0.8rem" />}>Table Settings</Tabs.Tab>
            <Tabs.Tab value="messages" icon={<IconMessageCircle size="0.8rem" />}>Notifications</Tabs.Tab>
          </Tabs.List>

          
        </Tabs>
      </Group>
    </Header>  
  )
}

export default TitleBar