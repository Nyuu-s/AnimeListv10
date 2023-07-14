import { createContext, useContext, useState } from "react";
import {AnimeDataSet, Animes, useCastTo} from '../Components/Helpers/useAnime'

type DataContextType = {
    getData(): Animes
    getHeaders(): Array<string>,

    setData(data: object): void,
    setHeaders(headers: Array<string>): void,
    setBothDataAndHeaders(obj: object): void
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
    }
});

function AnimeDataBuilder(obj: object): AnimesData
{
    const inputObject = obj as AnimeDataSet
    const DataSet = useCastTo<Animes>(inputObject);
    const DataHeaders = inputObject.headers
    return new AnimesData(DataSet,DataHeaders);
}

export function DataProvider({children}: {children: React.ReactNode})
{
    const [AnimesContent, setAnimesContent] = useState<AnimesData>()

    const setBothDataAndHeaders = (obj: object) => setAnimesContent(AnimeDataBuilder(obj));
    const setHeaders = (arr: string[]) => AnimesContent?.set_headers(arr); 
    const setData = (value: Animes) => AnimesContent?.set_data(value); 

    const getHeaders = () => (AnimesContent ? AnimesContent.get_headers() : [])
    const getData = () => (AnimesContent ? AnimesContent.get_data() : {});

    return (
        <DataContext.Provider value={{ setBothDataAndHeaders, getData, setData, setHeaders, getHeaders }}>
            {children}
        </DataContext.Provider>
    )
}

export function useDataState() 
{
    return useContext(DataContext);
}
