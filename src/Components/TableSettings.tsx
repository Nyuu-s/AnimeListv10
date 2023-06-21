import { Checkbox, Group, NumberInput, Slider, Switch } from "@mantine/core"

import { useAppState } from "../context/AppContext";

function TableSettings() {
    const tableSettings = useAppState().tableSettings;
   
    const MARKS = [
    { value: 0, label: 'xs' },
    { value: 25, label: 'sm' },
    { value: 50, label: 'md' },
    { value: 75, label: 'lg' },
    { value: 100, label: 'xl' },
    ];
  return (
    <>
        <div className='flex flex-col mt-10'>

            <Group className='flex justify-between'>
            <div className="mb-2">Vertical space</div>
            <Slider
                    id="vspacing"
                    className='mr-14'
                    w={150}
                    defaultValue={50}
                    step={25}
                    marks={MARKS}
                    onChange={(value) => tableSettings.changeVSpacing(MARKS.find((v) => v.value === value)?.label)}
                    styles={{ markLabel: { display: 'none' } }}
                    value={MARKS.find((v) => v.label === tableSettings.vSpacing)?.value}
                /> 
            </Group>


            <Group className='flex justify-between mt-5'>
            <div className="mb-2">Font size</div>
            <Slider
                id="fontsize"
                className='mr-14'
                w={150}
                defaultValue={50}
                step={25}
                marks={MARKS}
                onChange={(value) => tableSettings.changefontSize(MARKS.find((v) => v.value === value)?.label)}
                styles={{ markLabel: { display: 'none' } }}
                value={MARKS.find((v) => v.label === tableSettings.fontSize)?.value}
            />
            </Group>
            {/* <NumberInput defaultValue={itemsPerPages} onChange={setItemsPerPages} className="w-20 text-center" styles={{ input: { textAlign: 'center' } }}/> */}

            <Group className='flex justify-between mt-5'>
            <div className="mb-2">Items per pages</div>
            <NumberInput defaultValue={tableSettings.itemsPerPages} value={tableSettings.itemsPerPages} onChange={(value) => {
                tableSettings.changeItemsPP(value)
                
                
            }} w={150} className='mr-14' styles={{ input: { textAlign: 'center' } }}/>
            </Group>

            <Group className='flex justify-between mt-5'>
            <div className="mb-2">Sticky Header</div>
            <Checkbox  w={150} className='mr-14' checked={tableSettings.isSticky} size="md" onChange={() => tableSettings.changeStickness()}/>
            </Group>
        </div>
    </>
  )
}

export default TableSettings