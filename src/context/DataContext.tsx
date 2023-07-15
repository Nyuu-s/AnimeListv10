import { createContext, useContext, useState } from "react";
import {AnimeDataSet, Animes, useCastTo} from '../Components/Helpers/useAnime'
import { invoke } from "@tauri-apps/api";

type DataContextType = {
    getData(): Animes
    getHeaders(): Array<string>,

    setData(data: object): void,
    setHeaders(headers: Array<string>): void,
    setBothDataAndHeaders(obj: object): void,

    saveData(data?: object): Promise<Boolean>,
    removeRecords(IDArray: string[]) : void
}

class AnimesData {
    private data: Animes;
    private headers: string[];

    public get_data(): Animes {
        return this.data;
    }
    public set_data(value: Animes) {
        this.data = value;
    }
    public get_headers(): string[] {
        return this.headers;
    }
    public set_headers(value: string[]) {
        this.headers = value;
    }
    
    constructor(animes: Animes, headers: string[]){
        this.data = animes;
        this.headers = headers;
    }
}

const DataContext = createContext<DataContextType>({
    getData: function (): Animes {
        throw new Error("Function not implemented.");
    },
    getHeaders: function (): string[] {
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
    }
});

function AnimeDataBuilder(obj: object): AnimesData
{
    const inputObject = obj as AnimeDataSet
    const DataSet = inputObject.data as Animes;
    const DataHeaders = inputObject.headers
    return new AnimesData(DataSet,DataHeaders);
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
    const [AnimesContent, setAnimesContent] = useState<AnimesData>()

    const setBothDataAndHeaders = (obj: object) => setAnimesContent(AnimeDataBuilder(obj));
    const setHeaders = (arr: string[]) => AnimesContent?.set_headers(arr); 
    const setData = (value: Animes) => AnimesContent?.set_data(value); 
    
    const getHeaders = () => (AnimesContent ? AnimesContent.get_headers() : [])
    const getData = () => (AnimesContent ? AnimesContent.get_data() : {});
    const saveData = async (data?: object) => {
        if(AnimesContent === undefined)
        {
            return Promise.reject("Context is not yet defined")
        }
        if(data)
        {
            // modify current state before saving
            if(Array.isArray(data)){
                setHeaders(data as string[]);
            }
            else{
                setData(useCastTo<Animes>(data))
            }
        }
        return await onSaveData(AnimesContent)
    }
    
    const removeRecords = (idArray: string[]) => {
        setData(onRemoveRecords(idArray, getData()))
        saveData();
    };
    return (
        <DataContext.Provider value={{ setBothDataAndHeaders, removeRecords, getData, setData, setHeaders, getHeaders, saveData }}>
            {children}
        </DataContext.Provider>
    )
}

export function useDataState() 
{
    return useContext(DataContext);
}
