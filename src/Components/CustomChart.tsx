import { ChartData, ChartType } from "./Helpers/useCustomTypes"

import { Chart as ChartJS,
        ArcElement,
        Tooltip, 
        Legend ,  
        CategoryScale,  
        LinearScale,  
        PointElement, 
        LineElement, 
        Title,
    
    } from "chart.js";
import { Doughnut, Line, Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
);

interface ChartDataProps {
    chart: ChartData
}

function CustomChart({chart}: ChartDataProps) {
    const {datasets, labels, type} = chart
    

    if(type == ChartType.CDonut)
    {
        return (
           <Doughnut data={{
            labels: labels,
            datasets: datasets
           }}/>
          )
    }
    
    
    if(type == ChartType.CLine)
    {
        return (
            <>
            <Line data={{
                labels: labels,
                datasets: datasets
            }}/>
            </>
          )
    }

    
    if(type == ChartType.CPie)
    {
        return (
            <>
                <Pie data={{
                    labels: labels,
                    datasets: datasets
                }}/>
          
            </>
          )
    }
  
}

export default CustomChart