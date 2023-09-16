
import { Burger, Button, Center, Drawer, Group, Header, Modal, NumberInput, SegmentedControl, Select, Tabs , TransferList, TransferListData} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMessageCircle, IconSettings, IconUserShield } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import TableSettings from './Tabs/TableSettings';
import UserPreferences from './Tabs/UserPreferences';

import SimpleStatTableForm from './SimpleStatTableForm';



function TitleBar() {
const {opened, toggle} = useAppState().navState;
const [activeTab, setActiveTab] = useState<string | null>('first');
const [statsModal, setStatsModal] = useState(false)
const [segmentValue, setSegmentValue] = useState('tables');

const USER_SETTINGS_ID= 'user-settings';
const TABLE_SETTINGS_ID= 'table-settings';
const NOTIFICATIONS_ID= 'notifications-pannel';
const {pathname } = useLocation()
const [test, { open, close }] = useDisclosure(false);


  return (
    <Header height={60} mt={26} className='fixed z-50 h-full' p="xs">
      <Modal title={"Statistics"} size={1000} opened={statsModal} onClose={() => setStatsModal(false)}>
        <Center>

          <SegmentedControl
          value={segmentValue}
          transitionDuration={0.5}
          color='indigo'
          onChange={setSegmentValue}
          data={[
            { label: 'Tables', value: 'tables' },
            { label: 'Graphs', value: 'graphs' }
          ]}
        />
        </Center>
        {
          segmentValue === 'tables' && 
          <div className='h-screen'>
            <SimpleStatTableForm  />

          </div>
        }
      </Modal>
      <Group>
        <Burger opened={opened} onClick={toggle} className='mb-1'/>
        <Button onClick={() => setStatsModal(true)} > <span className='hover:text-gray-300'> Statistics</span></Button>
        
      </Group>
      
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
              disabled
              value={USER_SETTINGS_ID}
              onClick={() => {open()}}
              className={`${activeTab === USER_SETTINGS_ID ? "border-blue-500 hover:border-blue-500": ""}`} 
              icon={<IconUserShield size="0.8rem" />}>
                Users Preferences
            </Tabs.Tab> 
          
            <Tabs.Tab value={NOTIFICATIONS_ID} disabled className={`${activeTab === NOTIFICATIONS_ID ? "border-blue-500 hover:border-blue-500": ""}`} icon={<IconMessageCircle size="0.8rem" />}>Notifications</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={USER_SETTINGS_ID} pt="xs">
          <Drawer position='right' overlayProps={{opacity: 0.5 }} withCloseButton={false} opened={activeTab === TABLE_SETTINGS_ID && test} onClose={close}>
            {/* Drawer content */}
        
              <Drawer.Header >
                <Drawer.Title className='mt-20 text-2xl'>Table Settings</Drawer.Title>
                <Drawer.CloseButton size={30} className='absolute right-10' />
              </Drawer.Header>
              <Drawer.Body>
                <TableSettings />
              </Drawer.Body>
          
          </Drawer>

          <Drawer position='right'  withCloseButton={false} opened={activeTab === USER_SETTINGS_ID && test} onClose={close}>
            {/* Drawer content */}
         
              <Drawer.Header >
                <Drawer.Title  className='mt-20 text-2xl'>User Settings</Drawer.Title>
                <Drawer.CloseButton size={30} className='absolute right-10' />
              </Drawer.Header>
              <Drawer.Body >
                <UserPreferences />
              </Drawer.Body >
           
          </Drawer>
          </Tabs.Panel>
          
        </Tabs>
      </Group>
    </Header>  
  )
}

export default TitleBar