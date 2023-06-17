import { createContext, useContext, useState } from "react";

type EmptyBool = {
    all: boolean,
    data: boolean,
    headers: boolean
}

type DataContextType = {
    get(): object,
    set(json: object): void,
    getData(): object
    setDataOnly(data: object): void,
    getHeaders(): Array<string>,
    setHeadersOnly(headers: Array<string>): void,
    isEmpty: EmptyBool,

    // allData: object,
    // dataOnly: object,
    // headersOnly: Array<string>

    
}

const DataContext = createContext<DataContextType>({
    get: () => ({}),
    set: () => {},
    getData: () => ({}),
    setDataOnly: () => {},
    getHeaders: () => [],
    setHeadersOnly: () => {},
    isEmpty:  {all: true, data: true, headers: true},

    // allData: {},
    // dataOnly: {},
    // headersOnly: []

  });


export function DataProvider({children}: {children: React.ReactNode})
{
    const [allData, setData] = useState<object>({});
    const [dataOnly, setOnlyData] = useState<object>({});
    const [headersOnly, setOnlyHeaders] = useState<Array<string>>([]);
    const [isEmpty, setIsDataEmpty] = useState<EmptyBool>({all: true, data: true, headers: true});

    const set = (All: object) => {
        setData(All)
        
        
        Object.entries(All).length >= 0 ? setIsDataEmpty({...isEmpty, all: false }) : setIsDataEmpty({...isEmpty, all: true})
    };
    const get = (): object =>  (allData);
    const getData = (): object =>  (dataOnly);
    const getHeaders = (): Array<string> =>  (headersOnly);
    const setDataOnly = (data: object) => {
        setOnlyData(data)
        Object.entries(data).length >= 0 ? setIsDataEmpty({...isEmpty, data: false}) : setIsDataEmpty({...isEmpty, data: true})
    };
    const setHeadersOnly = (headers: []) => {
        setOnlyHeaders(headers)
        Object.entries(headers).length >= 0 ? setIsDataEmpty({...isEmpty, headers: false}) : setIsDataEmpty({...isEmpty, headers: true})
    };
    

    

    return (
        <DataContext.Provider value={{ isEmpty, set, get, getData, getHeaders, setDataOnly, setHeadersOnly }}>
            {children}
        </DataContext.Provider>
    )
}

export function useDataState() 
{
    return useContext(DataContext);
}
