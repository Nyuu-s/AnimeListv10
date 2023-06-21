

interface UrlProps {
    key: any,
    clickFunc: () => void,
    display: string,

}

const AnimesTableURL = (props: UrlProps) => {
  return (
    <td 

        key={props.key}
        className="cursor-text"
        //onClick={}  on click cell edit cell value
        
    >
          <span
          onClick={props.clickFunc}
          className="cursor-pointer hover:text-blue-500 hover:underline " 
          >{props.display}</span>
       

        
     </td>
  )
}

export default  AnimesTableURL;