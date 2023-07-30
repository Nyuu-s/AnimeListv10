import { createContext, useContext, useState } from "react";
import { Anime, AnimeDataSet, Animes, T_AnimeNoID, useCastTo } from '../Components/Helpers/useAnime';
import { invoke } from "@tauri-apps/api";

type DataContextType = {
    getData(): Animes
    getHeaders(): TDataHeaders,

    setData(data: object): void,
    setHeaders(headers: TDataHeaders): void,
    setBothDataAndHeaders(obj: object): void,

    saveData(typeOfData: number, data?: object): Promise<Boolean>,
    removeRecords(IDArray: string[]) : void

    sortData(direction: boolean, headerName: string) : Anime[]

    AnimesContent: AnimesData
}

type TDataHeaders = {header: string, headerType: string}[]
class AnimesData {
    private data: Animes;
    private headers: TDataHeaders;


    public get_data(): Animes {
        return this.data;
    }
    public set_data(value: Animes) {
        this.data = value;
    }
    public get_headers(): TDataHeaders {
        return this.headers;
    }
    public set_headers(value: TDataHeaders) {
        this.headers = value;
        this.computeTypes();
    }

    public sort_data(direction: boolean, header: string): Anime[]
    {
        let data2 =  Object.values(this.data);
        if(header === 'ID'){
            data2.sort((a, b) => {
                const comp = a.ID.toString().localeCompare(b.ID, "en", {numeric: true})
                return direction ? comp : -comp
            })
        }
        else
        {
           data2.sort((a, b) => {
            const comp = (a as T_AnimeNoID )[header].value.toString().localeCompare((b as T_AnimeNoID )[header].value, "en", {numeric: this.headers.find((v) => v.header === header)?.headerType === 'numeric'})
            return direction ? comp : -comp
           })

        }

        return data2
    }

    private RecTypeCheck = (rowID: number, header: string): string =>  {  
        if(rowID > Object.keys(this.data).length)
        {
            return "string";
        }
        if(header === 'ID')
        {
            const headerValue = this.data[rowID.toString()].ID
            if(headerValue === '' ||  headerValue === undefined){
                rowID += 1;
                return this.RecTypeCheck(rowID, header);
            }
            if(!Number.isNaN(Number.parseInt(headerValue))){
                return 'numeric'
            }
        }
        else
        {
            const headerValueAsObj = this.data[rowID][header] as {url: string, value: string}
            if(headerValueAsObj.value === '' ||  headerValueAsObj.value === undefined){
               
                rowID += 1;
                return this.RecTypeCheck(rowID, header);
            }
            if(!Number.isNaN(Number.parseInt(headerValueAsObj.value))){
                return 'numeric'
            }
        }

        return 'string';
    }
    public computeTypes = () => {
        this.headers.forEach((Value, index) => {
            this.headers[index].headerType = this.RecTypeCheck(1, Value.header);
        })
    }


    
    constructor(animes: Animes, headers: TDataHeaders){
        this.data = animes;
        this.headers = headers;
    }

}

const DataContext = createContext<DataContextType>({
    getData: function (): Animes {
        throw new Error("Function not implemented.");
    },
    getHeaders: function (): TDataHeaders {
        throw new Error("Function not implemented.");
    },

    setData: function (): void {
        throw new Error("Function not implemented.");
    },
    setHeaders: function (): void {
        throw new Error("Function not implemented.");
    },
    setBothDataAndHeaders: function (): void {
        throw new Error("Function not implemented.");
    },
    saveData:async function (): Promise<Boolean>{
        throw new Error("Function not implemented.");
    },
    removeRecords: function (): void {
        throw new Error("Function not implemented.");
    },
    sortData: function (): Anime[] {
        throw new Error("Function not implemented.")
    },
    
    AnimesContent: new AnimesData({}, [{header:'', headerType: ''}])
});

function AnimeDataBuilder(obj: object): AnimesData
{
    const inputObject = obj as AnimeDataSet
    const DataSet = inputObject.data as Animes;
    const DataHeaders: TDataHeaders = [];
    inputObject.headers.forEach((v) => {
        DataHeaders.push({header: v, headerType: '' })
    })
    return new AnimesData(DataSet, DataHeaders);
}

async function onSaveData(CurrentDataState: AnimesData): Promise<Boolean>
{
    return invoke('save_data', {data: CurrentDataState});
}

function onRemoveRecords(arr: string[], data: Animes) : Animes
{
    //find the smallest element in idArray, save the previous id of the smallest as iterator
    let iterator = Math.min(...arr.map(Number));
    // delete all objects with id in arr
    arr.map((id:string) => delete data[id] )
    //loop through data and update ID and key
    let keys = Object.keys(data).map(Number);
    
    keys.forEach((key) => {
        if (key > iterator) {
          data[iterator] = data[key];
          data[iterator].ID = `${iterator++}`
          delete data[key];
        }
    })
 
    return data;
}


export function DataProvider({children}: {children: React.ReactNode})
{
    const [AnimesContent, setAnimesContent] = useState<AnimesData>(new AnimesData({}, []))

    const setBothDataAndHeaders = (obj: object) => setAnimesContent(AnimeDataBuilder(obj));
    const setHeaders = (arr: TDataHeaders) => AnimesContent?.set_headers(arr); 
    const setData = (value: Animes) => AnimesContent?.set_data(value); 
    const sortData = (dir: boolean, headerName: string) => AnimesContent.sort_data(dir, headerName);
    const getHeaders = () => (AnimesContent ? AnimesContent.get_headers() : [])
    const getData = () => (AnimesContent ? AnimesContent.get_data() : {});
    /**
     * 
     * @param typeOfData 0 to save current data, 1 if data are headers, 2 if data contains all records, 3 data is one record
     * @param data 
     * @returns 
     * 
     */
    const saveData = async (typeOfData: number, data?: object) => {
        if(AnimesContent === undefined)
        {
            return Promise.reject("Context is not yet defined")
        }
        if(data)
        {
            switch (typeOfData) {
                case 1: // Modify headers
                    setHeaders(data as TDataHeaders);
                    break;
                case 2:// Modify Data, by giving a new data object with all records
                    setData(useCastTo<Animes>(data))
                    break;
                case 3:// Modify Data by giving only 1 record
                    const temp = data as Anime;
                    const newData = getData();
                    newData[temp.ID] = temp;
                    setData(newData);
                    break;
            
                default:
                    break;
            }
        }
        return await onSaveData(AnimesContent)
    }

    const removeRecords = (idArray: string[]) => {
       
        setAnimesContent(new AnimesData(onRemoveRecords(idArray, getData()),getHeaders()));
        saveData(0);
    };
    return (
        <DataContext.Provider value={{ 
            sortData, 
            setBothDataAndHeaders, 
            removeRecords, 
            getData, 
            setData, 
            setHeaders, 
            getHeaders, 
            saveData, 
            AnimesContent }}>
            {children}
        </DataContext.Provider>
    )
}

export function useDataState() 
{
    return useContext(DataContext);
}
