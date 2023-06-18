
import { IconMessageCircle, IconUserShield, IconSettings } from '@tabler/icons-react';
import { useAppState } from '../context/AppContext';
import { Header, Burger, Tabs, Group, Drawer } from '@mantine/core'
import {  useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import TableSettings from './TableSettings';


function TitleBar() {
const {opened, toggle} = useAppState().navState;
const [activeTab, setActiveTab] = useState<string | null>('first');
const USER_SETTINGS_ID= 'user-settings';
const TABLE_SETTINGS_ID= 'table-settings';
const NOTIFICATIONS_ID= 'notifications-pannel';
const {pathname } = useLocation()
const [test, { open, close }] = useDisclosure(false);


  return (
    <Header height={60} mt={26} className='fixed z-50 h-full' p="xs">
      <Burger opened={opened} onClick={toggle} className='mb-1'/>
      <Group className='justify-end absolute top-2 right-0  '>

          <Tabs value={activeTab} onTabChange={setActiveTab}  className='mt-4'>
          <Tabs.List grow >
            {pathname === "/list" &&   
              <Tabs.Tab value={TABLE_SETTINGS_ID} 
                onClick={() => {open()}}
                className={`${activeTab === TABLE_SETTINGS_ID ? "border-blue-500 hover:border-blue-500": ""}`} 
                icon={<IconSettings size="0.8rem" />}>
                

                Table Settings
              </Tabs.Tab>
            }
            <Tabs.Tab 
                value={USER_SETTINGS_ID}
                disabled
                className={`${activeTab === USER_SETTINGS_ID ? "border-blue-500 hover:border-blue-500": ""}`} 
                icon={<IconUserShield size="0.8rem" />}>
                  
                  Users Settings
            </Tabs.Tab> 
          
            <Tabs.Tab value={NOTIFICATIONS_ID} disabled className={`${activeTab === NOTIFICATIONS_ID ? "border-blue-500 hover:border-blue-500": ""}`} icon={<IconMessageCircle size="0.8rem" />}>Notifications</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={USER_SETTINGS_ID} pt="xs">
          <Drawer position='right' overlayProps={{opacity: 0.5 }} withCloseButton={false} opened={test} onClose={close}>
            {/* Drawer content */}
            <Drawer.Content>
              <Drawer.Header >
                <Drawer.Title className='mt-20 text-2xl'>Table Settings</Drawer.Title>
                <Drawer.CloseButton size={30} className='absolute right-10' />
              </Drawer.Header>
              <Drawer.Body>
                
                <TableSettings />
             
              </Drawer.Body>
            </Drawer.Content>
          </Drawer>
          </Tabs.Panel>
          
        </Tabs>
      </Group>
    </Header>  
  )
}

export default TitleBar