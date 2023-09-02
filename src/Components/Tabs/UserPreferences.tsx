import { Checkbox, Group } from "@mantine/core"
import { useAppState } from "../../context/AppContext";


function UserPreferences() {
    const {userPreferences} = useAppState()
    const BetaTag = <span className="text-red-600 text-opacity-70 ">*Beta* </span>;
  return (
    <div className='flex flex-col mt-10 w-full'>
            <Group >
                <div className="mb-2">
                    {BetaTag} Auto Window Position       
                </div>
           

                <Checkbox disabled w={150} mb={7} checked={userPreferences.isAutoWindowCfgSave} size="md" onChange={() => {userPreferences.changeIsAutoWindowCfgSave()}}/>
        
            </Group>

    </div>
  )
}

export default UserPreferences