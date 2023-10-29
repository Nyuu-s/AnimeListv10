import { Modal, Center, SegmentedControl, Button } from "@mantine/core";

import { useState } from "react";
import ChartForm from "./ChartForm";
import { ChartData, SimpleTableData } from "./Helpers/useCustomTypes";
import SimpleStatTableForm from "./SimpleStatTableForm";
import StatsChartsList from "./StatsChartsList";
import StatsTablesList from "./StatsTablesList";


function Statistics() {
    const [statsModal, setStatsModal] = useState(false)
    const [segmentValue, setSegmentValue] = useState('tables');
    const [openTableForm, setopenTableForm] = useState(false);
    const [openChartForm, setopenChartForm] = useState(false);
    const [editTableData, seteditTableData] = useState<SimpleTableData | undefined>();
    const [editChartData, seteditChartData] = useState<ChartData | undefined>();
  return (
    <>
        <Modal title={"Statistics"} size={1000} opened={statsModal} onClose={() => setStatsModal(false)}>
            <Center>

            <SegmentedControl
            value={segmentValue}
            transitionDuration={0.5}
            color='indigo'
            onChange={setSegmentValue}
            data={[
                { label: 'Tables', value: 'tables' },
                { label: 'Charts', value: 'charts' }
            ]}
            />
            </Center>
            {
            segmentValue === 'tables' && 
            <div className='h-screen'>
                {!openTableForm && <Button variant='filled' color='indigo' className='my-5' onClick={() => {
                seteditTableData(undefined)
                setopenTableForm(true)
                }}>New Table</Button>}
                { openTableForm && <SimpleStatTableForm setFormState={setopenTableForm} editData={editTableData} />}
                {!openTableForm && <StatsTablesList setFormState={setopenTableForm} setEditData={seteditTableData}/>}

            </div>
            }
            {
            segmentValue == 'charts' &&
            <div className='h-screen'>
                {!openChartForm && <Button variant='filled' color='indigo' className='my-5' onClick={() => {
                seteditChartData(undefined)
                setopenChartForm(true)
                }}>New Chart</Button>}
                { openChartForm && <ChartForm editData={editChartData} setFormState={setopenChartForm} />}
                {!openChartForm && <StatsChartsList setFormState={setopenChartForm} setEditData={seteditChartData}/>}

                
            </div>
            }
        </Modal>
        <Button onClick={() => setStatsModal(true)} > <span className='hover:text-gray-300'> Statistics</span></Button>
    </>
  )
}

export default Statistics