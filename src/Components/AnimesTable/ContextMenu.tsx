import { Menu, ScrollArea } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconSettings, IconTrash } from "@tabler/icons-react";
import { ForwardedRef, forwardRef } from "react";
import { useDataState } from "../../context";



interface ctx {
    position: { x: number, y: number},
    setEdit: (value: boolean) => void
    setShown: (value: boolean) => void,
    IDs: string[],
    SingleID: string
}

const ContextMenu = forwardRef((props: ctx, ref: ForwardedRef<HTMLDivElement>) => {
  const { height } = useViewportSize();
  const {removeRecords} = useDataState()
  // const IDList = [ ...(new Set([props.SingleID.toString(), ...props.IDs ]))]
  const IDList = props.IDs.length > 0 ? props.IDs : [props.SingleID]
  console.log(IDList, props.SingleID, props.IDs);
  
  return (
    <>
        {  <div
        style={{ top: Math.abs(height - props.position.y) < 100 ? props.position.y -100: props.position.y - 30  , left: props.position.x + 10 }}
        className="fixed z-50 h-40"
        ref={ref}
        
        >
    <Menu shadow="md" opened  closeOnClickOutside closeOnItemClick  width={200}>
      <Menu.Dropdown >
        <ScrollArea >
            <Menu.Label>Row: {IDList.join(', ')}</Menu.Label>
            <Menu.Item icon={<IconSettings size={14} />} onClick={() => props.setEdit(true)}>Edit</Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" icon={<IconTrash size={14} />} onClick={() => {
              removeRecords(IDList)
              window.dispatchEvent(new CustomEvent('DeleteRows', {}))
              props.setShown(false)
            }} >Delete</Menu.Item>
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
        </div>}
    </>
  );
});


export default ContextMenu;
