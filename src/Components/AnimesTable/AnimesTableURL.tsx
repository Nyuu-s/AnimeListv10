

interface UrlProps {
    id: any,
    clickFunc: () => void,
    navigateFunc: () => void,
    display: string,

}

const AnimesTableURL = (props: UrlProps) => {
  return (
    <td 

        key={props.id}
        className="cursor-text"
        //onClick={}  on click cell edit cell value
        onDoubleClick={props.navigateFunc}
    >
          <span
          onClick={props.clickFunc}
          className="cursor-pointer hover:text-blue-500 hover:underline " 
          >{props.display}</span>
       

        
     </td>
  )
}

export default  AnimesTableURL;