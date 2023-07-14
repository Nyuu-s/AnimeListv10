
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { toast } from 'react-toastify';





function transformhHours(hours: number) : {Total_minutes: number, Total_days: number, Total_years: number,Total_Hours: number, sentence: string }
{

  const HOURS_IN_DAY = 24;
  const DAYS_IN_WEEK = 7;
  const DAYS_IN_YEAR = 365

  const total_years = Math.floor((hours / (DAYS_IN_YEAR * HOURS_IN_DAY)));
  let remaining_hours = Math.floor(hours - (total_years *  DAYS_IN_YEAR * HOURS_IN_DAY)) ;
 
  const remaining_week = Math.floor( remaining_hours / (DAYS_IN_WEEK * HOURS_IN_DAY));
  remaining_hours = Math.floor(remaining_hours - (remaining_week * DAYS_IN_WEEK * HOURS_IN_DAY));

  const remianing_days = Math.floor(remaining_hours / HOURS_IN_DAY);
  remaining_hours = Math.floor(remaining_hours - (remianing_days * HOURS_IN_DAY));

   

  let str = ""
  if(total_years > 1)
  {
    str += total_years + `${total_years > 1 ? " years" : " year"} `
  }
  if(remaining_week > 1)
  {
    str += remaining_week +  `${remaining_week > 1 ? " weeks" : " week"} ${remianing_days > 0 ? ' and ' : ''  }`
  }
  if(remianing_days > 1)
  {
    str += remianing_days +  `${remianing_days > 1 ? " days" : " day"} ${remaining_hours > 0 ? ' and ' : ''  } `
  }
  if(remaining_hours > 1)
  {
    str += remaining_hours +  `${remaining_hours > 1 ? " hours" : " hour"} } `
  }

  const result = {
    Total_minutes: hours * 60.0,
    Total_days: hours / HOURS_IN_DAY,
    Total_years: total_years,
    Total_Hours: hours,
    sentence: str
  }
  return result
}

export default function Home() {

  const notify =  async () =>{
     toast("Wow so easy !")
  
    
    };

  const tansformedHours = transformhHours(1800);
  return (
    <>

      <Card shadow="sm" padding="lg" radius="md" withBorder w={300}>

        <Card.Section>
          <Image
            src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            height={160}
            alt="Norway"
            />
        </Card.Section>

        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Total hours Spent </Text>
          <Badge color="pink" variant="light">
            {tansformedHours.Total_Hours }
            {tansformedHours.Total_Hours > 1 ? " HOURS" : " HOUR" } 
          </Badge>
        </Group>

        <Text size="sm" color="dimmed">
            You watched the equivalent of {tansformedHours.sentence}
        </Text>

        <Button onClick={notify} variant="light" color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button>
      </Card>
    </>
  );
}
