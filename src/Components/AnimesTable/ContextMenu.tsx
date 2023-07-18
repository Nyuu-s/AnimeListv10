import { Menu, Button, Text } from "@mantine/core";
import { IconSettings, IconMessageCircle, IconPhoto, IconSearch, IconArrowsLeftRight, IconTrash } from "@tabler/icons-react";
import { useRef } from "react";



interface ctx {
    isShown: boolean,
    position: { x: number, y: number},
    ID: string
}

const ContextMenu = (props: ctx) => {





  return (
    <>
        { props.isShown && <div
        style={{ top: props.position.y, left: props.position.x }}
        className="fixed z-50"
      
        
        >
 <Menu shadow="md" opened={props.isShown} closeOnClickOutside width={200}>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
        <Menu.Item icon={<IconMessageCircle size={14} />}>Messages</Menu.Item>
        <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
        <Menu.Item
          icon={<IconSearch size={14} />}
          rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
        >
          Search
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item icon={<IconArrowsLeftRight size={14} />}>Transfer my data</Menu.Item>
        <Menu.Item color="red" icon={<IconTrash size={14} />}>Delete my account</Menu.Item>
      </Menu.Dropdown>
    </Menu>
        </div>}
    </>
  );
};

export default ContextMenu;
