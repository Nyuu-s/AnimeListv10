import { invoke } from "@tauri-apps/api";
import { createContext, useContext, useState } from "react";
import { Record, RecordDataSet, Records, TDataHeaders, THeader, T_RecordNoID, useCastTo } from '../Components/Helpers/useRecord';

type DataContextType = {
    getData(): Records
    getHeaders(): TDataHeaders,
    
    setData(data: object): void,
    setHeaders(headers: TDataHeaders): void,
    setBothDataAndHeaders(obj: object): void,
    addRecord(record: Record): void,
    addHeader(newHeader: THeader): void
    deleteHeader(headerName: string): void
    saveData(typeOfData: number, data?: object): Promise<Boolean>,
    removeRecords(IDArray: string[]) : void

    sortData(direction: boolean, headerName: string) : Record[]

    RecordsContent: RecordsData
}


class RecordsData {
    private data: Records;
    private headers: TDataHeaders;


    public get_data(): Records {
        return this.data;
    }
    public set_data(value: Records) {
        this.data = value;
    }
    public get_headers(): TDataHeaders {
        return this.headers;
    }
    public set_headers(value: TDataHeaders) {
        this.headers = value;
        this.computeTypes();
    }

    public add_record(record: Record) {
        let newID = Object.keys(this.data).length+1;
        record.ID = `${newID}`
        this.data = {...this.data, [newID]: record}
    }
    public add_header(newHeader: THeader)
    {
        this.headers.push(newHeader)
    }
    public delete_header(headerName: string)
    {
        this.headers = this.headers.filter((v) => v.header !== headerName);
    }

    public get_headers_list() {
        if (this.headers.length > 0)
        {
            if( typeof this.headers[0] !== 'object')
            {
                return this.headers
            }
            else
            {
               return this.headers.map((value) => (value.header))
            }
            
        }
    }

    public sort_data(direction: boolean, header: string): Record[]
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
            const comp = (a as T_RecordNoID )[header].value.toString().localeCompare((b as T_RecordNoID )[header].value, "en", {numeric: this.headers.find((v) => v.header === header)?.headerType === 'numeric'})
            return direction ? comp : -comp
           })

        }

        return data2
    }

    private RecTypeCheck = (rowID: number, header: string): string =>  {  
        // // let headerName:string;
        // typeof header === 'object' ?
        //     headerName = header['header']
        // :
        //     headerName = header;
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
            if(headerValueAsObj){
                if(headerValueAsObj.value === '' ||  headerValueAsObj.value === undefined){
                   
                    rowID += 1;
                    return this.RecTypeCheck(rowID, header);
                }
                if(!Number.isNaN(Number.parseInt(headerValueAsObj.value))){
                    return 'numeric'
                }
            }
        }

        return 'string';
    }
    public computeTypes = () => {
        this.headers.forEach((Value, index) => {
            this.headers[index].headerType = this.RecTypeCheck(1, Value.header);
        })
    }


    
    constructor(records: Records, headers: TDataHeaders){
        this.data = records;
        this.headers = headers;
        this.computeTypes(); // TODO find when to call this to avoid calling it on each delete row operation
    }

}

const DataContext = createContext<DataContextType>({
    getData: function (): Records {
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
    sortData: function (): Record[] {
        throw new Error("Function not implemented.")
    },
    addRecord: function (): Record[] {
        throw new Error("Function not implemented.")
    },
    addHeader: function (): Record[] {
        throw new Error("Function not implemented.")
    },
    deleteHeader: function (): Record[] {
        throw new Error("Function not implemented.")
    },

    
    RecordsContent: new RecordsData({}, [{header:'', headerType: ''}])
});

function RecordDataBuilder(obj: object): RecordsData
{
    if(Object.keys(obj).length <= 0)
    {
        return new RecordsData({}, []);
    }
    const inputObject = obj as RecordDataSet
    const DataSet = inputObject.data as Records;
    const DataHeaders: TDataHeaders = [];
    if(typeof inputObject.headers[0] === 'object')
    {
        inputObject.headers.forEach((v) => {
            const value = v as {header: string, headerType: string}
            DataHeaders.push(value)
         })
    }
    else
    {
        inputObject.headers.forEach((v) => {
           DataHeaders.push({header: v as string, headerType: '' })
        })
    }
    return new RecordsData(DataSet, DataHeaders);
}

async function onSaveData(CurrentDataState: RecordsData): Promise<Boolean>
{
    return invoke('save_data', {data: CurrentDataState});
}

function onRemoveRecords(arr: string[], data: Records) : Records
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
    const [RecordsContent, setRecordsContent] = useState<RecordsData>(new RecordsData({}, []))

    const setBothDataAndHeaders = (obj: object) => setRecordsContent(RecordDataBuilder(obj));
    const setHeaders = (arr: TDataHeaders) =>  setRecordsContent((prev) => {
       return  new RecordsData({...prev.get_data()}, arr)
    })
    const setData = (value: Records) => setRecordsContent((prev) => {
        return  new RecordsData(value, [...prev.get_headers()])
     })
    const sortData = (dir: boolean, headerName: string) => RecordsContent.sort_data(dir, headerName);
    const getHeaders = () => (RecordsContent ? RecordsContent.get_headers() : [])
    const addRecord = (record: Record) => setRecordsContent((prev) => {
        const newRecord = new RecordsData(prev.get_data(), prev.get_headers())
        newRecord.add_record(record);
        return newRecord;
    })
    const addHeader = (newHeader: THeader) => { setRecordsContent((prev) => {
        const newRecord = new RecordsData(prev.get_data(), prev.get_headers())
        newRecord.add_header(newHeader);
        return newRecord;
    })
    }
    const deleteHeader = (headerName: string) => { setRecordsContent((prev) => {
        const newRecord = new RecordsData(prev.get_data(), prev.get_headers())
        newRecord.delete_header(headerName);
        return newRecord;
    })}
    const getData = () => (RecordsContent ? RecordsContent.get_data() : {});
    /**
     * 
     * @param typeOfData 0 to save current data, 1 if data are headers, 2 if data contains all records, 3 data is one record
     * @param data 
     * @returns 
     * 
     */
    const saveData = async (typeOfData: number, data?: object) => {
        if(RecordsContent === undefined)
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
                    setData(useCastTo<Records>(data))
                    break;
                case 3:// Modify Data by giving only 1 record
                    const temp = data as Record;
                    const newData = getData();
                    newData[temp.ID] = temp;
                    setData(newData);
                    break;
            
                default:
                    break;
            }
        }
        return await onSaveData(RecordsContent)
    }

    const removeRecords = (idArray: string[]) => {
       
        setRecordsContent(new RecordsData(onRemoveRecords(idArray, getData()),getHeaders()));
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
            addRecord,
            addHeader,
            deleteHeader,
            RecordsContent }}>
            {children}
        </DataContext.Provider>
    )
}

export function useDataState() 
{
    return useContext(DataContext);
}
