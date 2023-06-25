import { Checkbox, Group } from "@mantine/core"
import { useAppState } from "../../context/AppContext";


function UserSettings() {
    const {userSettings} = useAppState()
    const BetaTag = <span className="text-red-600 text-opacity-50 ">*Beta* </span>;
  return (
    <div className='flex flex-col mt-10 w-full'>
            <Group >
                <div className="mb-2">
                    {BetaTag} Auto Window position       
                </div>
           

                <Checkbox  w={150} mb={7} checked={userSettings.isAutoWindowCfgSave} size="md" onChange={() => {userSettings.changeIsAutoWindowCfgSave()}}/>
        
            </Group>

    </div>
  )
}

export default UserSettings