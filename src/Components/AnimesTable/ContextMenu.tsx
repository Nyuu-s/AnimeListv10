import { Menu, Button, Text, ScrollArea } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconSettings, IconMessageCircle, IconPhoto, IconSearch, IconArrowsLeftRight, IconTrash } from "@tabler/icons-react";
import { ForwardedRef, forwardRef } from "react";



interface ctx {
    position: { x: number, y: number},
    ID: string
}

const ContextMenu = forwardRef((props: ctx, ref: ForwardedRef<HTMLDivElement>) => {
  const { height } = useViewportSize();
  return (
    <>
        {  <div
        style={{ top: Math.abs(height - props.position.y) < 100 ? props.position.y -100: props.position.y - 30  , left: props.position.x }}
        className="fixed z-50 h-40"
        ref={ref}
        
        >
    <Menu shadow="md" opened  closeOnClickOutside closeOnItemClick  width={200}>
      <Menu.Dropdown >
        <ScrollArea >
            <Menu.Label>Row: {props.ID}</Menu.Label>
            <Menu.Item icon={<IconSettings size={14} />}>Edit</Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete</Menu.Item>
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
        </div>}
    </>
  );
});


export default ContextMenu;
