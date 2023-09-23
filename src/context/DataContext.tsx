import { invoke } from "@tauri-apps/api";
import { createContext, useContext, useEffect, useState } from "react";
import { Record, RecordDataSet, Records, TDataHeaders, THeader, T_RecordNoID, useCastTo } from '../Components/Helpers/useRecord';
import { toast } from "react-toastify";
import { TransferListData } from "@mantine/core";

type DataContextType = {
    addSimpleStatTable(data: SimpleTableData): void
    getData(): Records
    getHeaders(): TDataHeaders,
    updateColumn(header:string, toBeRestricted: string[]): boolean
    setData(data: object): void,
    setHeaders(headers: TDataHeaders): void,
    setBothDataAndHeaders(obj: object): void,
    addRecord(record: Record): void,
    addHeader(newHeader: THeader): void
    deleteHeader(headerName: string): void
    saveData(typeOfData: number, data?: object): Promise<Boolean>,
    removeRecords(IDArray: string[]) : void
    getPossibleValues(headerName: string): Array<string>,
    sortData(direction: boolean, headerName: string) : Record[]
    restrictedValues: RestrictedValues,
    SimpleStatTablesData: SimpleTableData[],
    RecordsContent: RecordsData
}

class Table2H {
    public column_header: string;
    public column_values: [];
    public row_values: [];
    public row_header: string;

    constructor(CHeader: string, RHeader: string)
    {
        this.column_header = CHeader;
        this.row_header = RHeader;
        this.column_values = [];
        this.row_values = [];
    }
}

type SimpleTableData = {
    rows: TransferListData | string[],
    cols: TransferListData | string[],
    dataCounts: number[][]
    title: string,
    maxSize: {MaxRows: number, MaxCols: number}
  }

class RecordsData {
    private data: Records;
    private headers: TDataHeaders;
    // private tablesH2: Table2H[]

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
        // this.tablesH2 = [];
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
    getPossibleValues: function (): Array<string> {
        throw new Error("Function not implemented.")
    },
    updateColumn: function (): boolean {
        throw new Error("Function not implemented.")
    },
    
    addSimpleStatTable: function (): void
    {
        throw new Error("Function not implemented.")
    },


    restrictedValues: {} as RestrictedValues,
    SimpleStatTablesData: [] as SimpleTableData[],
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

async function onSaveData(CurrentDataState: RecordsData, restrictedValues: RestrictedValues): Promise<Boolean>
{
    return invoke('save_data', {data: CurrentDataState, restricted: {restrictions: restrictedValues}});
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

type RestrictedValues = {
    [key: string]: string[]
}

export function DataProvider({children}: {children: React.ReactNode})
{
    const [RecordsContent, setRecordsContent] = useState<RecordsData>(new RecordsData({}, []))
    const [restrictedValues, setRestrictedValues] = useState<RestrictedValues>({})
    const [SimpleStatTablesData, setSimpleStatTablesData] = useState<SimpleTableData[]>([])

    const addSimpleStatTable = (data: SimpleTableData ) =>{ 
       
        setSimpleStatTablesData((prev) => [...prev, data] )
    
    }

    useEffect(() => {
        console.log(restrictedValues);
    }, [restrictedValues])
    

    const setBothDataAndHeaders = (obj: any) => {
        setRecordsContent(RecordDataBuilder(obj))
        setRestrictedValues(obj['restrictions'] as RestrictedValues)
        
    };
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
        return await onSaveData(RecordsContent, restrictedValues)
    }
    

    const updateColumn = (header:string, toBeRestricted: string[]): boolean =>  {
       try {
        
           let restrictionObj =  {...restrictedValues, [header]: toBeRestricted}
           let headerInfos = RecordsContent.get_headers().find((v) => v.header === header)
           if(headerInfos && headerInfos.headerType === 'numeric')
           {
                toast.error('Restricting numeric values is not yet implemented', {theme: "colored"}) 
                return false;
           }
           setRestrictedValues(restrictionObj)
            
            Object.values(RecordsContent.get_data()).forEach((obj) => {
               let noid = obj as T_RecordNoID;
               let newStr:  string[] = []
               let str = noid[header].value ? noid[header].value : '' ;
               str.split(',').forEach((value) => {
                
                   
                   if(restrictionObj[header] && restrictionObj[header].some((possibleValue) => possibleValue.trim() === value.trim()))
                   {
                       newStr.push(value)
                   }
                 
               });
   
   
                   noid[header].value = newStr.join(', ');
               
           })
           
          
           onSaveData(RecordsContent, restrictionObj)
           return true
       } catch (error) {
            return false
       }
    }
    const getPossibleValues = (headerName: string) =>
    {
        let headerInfo = RecordsContent.get_headers().find((element) => element.header == headerName)
        let valueSet = new Set<string>()

        

            Object.values(RecordsContent.get_data()).forEach((obj) => {
    
                let noid = obj as T_RecordNoID;
                let str = noid[headerName].value ? `${noid[headerName].value}` : '' ;
                str.split(',').forEach((value) => {
                    let lowerStr = value.trim().toLowerCase();
                    valueSet.add(lowerStr.charAt(0).toUpperCase() + lowerStr.slice(1))
                });
                
                
            })
        
        
        return Array.from(valueSet).sort((a,b) => {
            if(headerInfo && headerInfo.headerType === 'numeric')
            {
                let a_number =  parseInt(a)
                let b_number =  parseInt(b)
                if(a.trim() == '')
                    a_number = Infinity;
                if(b.trim() == '')
                    b_number == Infinity;
              return a_number > b_number ? 1 : -1   
            }
            return a > b ? 1 : -1
            
        });
        
    }

    const removeRecords = (idArray: string[]) => {
       
        setRecordsContent(new RecordsData(onRemoveRecords(idArray, getData()),getHeaders()));
        saveData(0);
    };
    return (
        <DataContext.Provider value={{ 
            addSimpleStatTable,
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
            getPossibleValues,
            updateColumn,
            restrictedValues,
            SimpleStatTablesData,
            RecordsContent }}>
            {children}
        </DataContext.Provider>
    )
}

export function useDataState() 
{
    return useContext(DataContext);
}
