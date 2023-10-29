
import { Badge, Card, Group, Image, Skeleton, Text, TransferListData } from '@mantine/core';
import SimpleStatTable from '../Components/SimpleStatTable';
import { useDataState } from '../context';






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

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import CustomChart from '../Components/CustomChart';

ChartJS.register(ArcElement, Tooltip, Legend);




export default function Home() {
  const {SimpleStatTablesData, chartsCollection} = useDataState()
  const tansformedHours = transformhHours(1800);



  
 
    
    return (
      <>
      
      <Group>

      <Card shadow="sm" padding="lg" radius="md" withBorder w={300} >
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


      </Card>
        {chartsCollection.map((v, i) => {
          if(v.visibility)
          {
            return (
              <Card key={i}>
                <Group w={500}>
                  <Text weight={500}>{v.title}</Text>
                  <CustomChart chart={v}/>
                </Group>
              </Card>
            )
          }
        })

        }

        {SimpleStatTablesData.map((v, i) => {
          if(v.visibility)
          {

            return(
            <Card key={i} shadow="sm" padding="lg" radius="md" withBorder >
              <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>{v.title}</Text>
              </Group>

              <SimpleStatTable cols={v.cols} rows={v.rows} title={v.title} counts={v.dataCounts} maxSize={v.maxSize}   />
            </Card>
            )
          }

        })
        } 
    
      </Group>
    </>
  );
}
