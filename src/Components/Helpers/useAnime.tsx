import { ASTKinds, comparison_1, comparison_2, comparison_3, statement_1, statement, and_1, not_statement, or_1 } from "../output";


export type T_AnimeNoID = {
    [key: string]: { url: string; value: string };
}

export type Anime  = {
    [key: string]: string | { url: string; value: string };
    ID: string
}

export type Animes  = {
  [key: string]: Anime;
}

export type AnimeDataSet  = {
    data:  Animes;
    headers: string[],   
}



export class AnimeNoID {
    private data: T_AnimeNoID;

    constructor(animeNoID: T_AnimeNoID) {
        this.data = {...animeNoID}
      }

    getAnime(): T_AnimeNoID {
        return this.data;
    }
    setAnime(anime: T_AnimeNoID)
    {
        this.data = anime;
    }

  // Implement the [Symbol.iterator]() method
  [Symbol.iterator](): Iterator<{ url: string; value: string }> {
    let properties = Object.keys(this.data);
    let count = 0;
    let isDone = false;

    let next = (): IteratorResult<{ url: string; value: string }> => {
      if (count >= properties.length) {
        isDone = true;
      }
      return { done: isDone, value: this.data[properties[count++]] };
    };

    return { next };
  }
    
      map(fn: (value: { url: string; value: string }, key: string) => any): any[] {
        let result = [];
        for (let key in this.data) {
          if (this.data.hasOwnProperty(key)) {
            result.push(fn(this.data[key], key));
          }
        }
        return result;
      }

}
type ConditionalType<T> = T extends Animes ? Animes : T_AnimeNoID;
export function  useCastTo<T extends T_AnimeNoID | Animes> (obj: any) : ConditionalType<T>{
  
  // Initialize the new object
  const newObject: ConditionalType<T> = {};

  for (const key in obj) {
    // Check if the property is of the desired format
    if (!Array.isArray(obj[key]) && typeof obj[key] === 'object' ) 
      {
          newObject[key] = obj[key];
      }
  }
  return newObject;
}

export const useCastToAnimeNoID = (obj: any): T_AnimeNoID => {
  
    // Initialize the new object
    const newObject: T_AnimeNoID = {};

    for (const key in obj) {
      // Check if the property is of the desired format
      if (typeof obj[key] === 'object') 
        {
            newObject[key] = obj[key];
        }
    }
    return newObject;
  }

 export type TDataHeaders = {header: string, headerType: string}[]

  type Operation = {
    [key: string]: (a: any, b: any) => boolean;
  };
  const operations: Operation = {
    '==': (a:any, b:any): boolean => a === b,
    '<=': (a:any, b:any): boolean => a <= b,
    '>=': (a:any, b:any): boolean => a >= b,
    '>': (a:any, b:any): boolean => a > b,
    '<': (a:any, b:any): boolean => a < b,
    '=': (a:string, b:string): boolean => a.includes(b),
  };
export const computeComp1 = (row: Anime, comp: comparison_1, headers: TDataHeaders): boolean =>  {
    let result = false;
    const compID = comp.id.toLocaleString();
    const isNumeric = headers.find((v) => v.header === compID)?.headerType === 'numeric';
    const rowHeader = row[compID] !== undefined ?
      row[compID] : 
      row[compID.toLowerCase()] !== undefined ? 
      row[compID.toLowerCase()] : 
      row[compID.toUpperCase()] !== undefined ?
      row[compID.toUpperCase()] :
      row[compID.charAt(0).toLocaleUpperCase() + compID.toLowerCase().slice(1)]
    const isID = !(typeof rowHeader === 'object')
  
    if(!rowHeader)
    {
      return result;
    }
    
    
    let a
    let b
    if(!isID)
    {
      a = isNumeric ? parseInt(rowHeader.value?.toString()) : rowHeader.value?.toString()
      b = isNumeric ? parseInt(comp.value?.toLocaleString()) : comp.value?.toLocaleString()
    }
    else if ( comp.comp_op === '=' ) 
    {
     a = row.ID?.toString()
     b =  comp.value?.toLocaleString();
    }
    else
    {
     a = parseInt(row.ID);
     b = parseInt(comp.value.toLocaleString());
    }

    if (a && b && comp.comp_op in operations )
    {
      result = operations[comp.comp_op](a, b);
    }
    return result;
  }

 export const computeComp2 = (row: Anime, comp: comparison_2, headers: TDataHeaders) => {
    let result = false;
    const compID = comp.id.toLocaleString();
    
    const isNumeric = headers.find((v) => v.header.toLowerCase() === compID.toLowerCase())?.headerType === "numeric";
    const rowHeader = row[compID] !== undefined ?
    row[compID] : 
    row[compID.toLowerCase()] !== undefined ? 
    row[compID.toLowerCase()] : 
    row[compID.toUpperCase()] !== undefined ?
    row[compID.toUpperCase()] :
    row[compID.charAt(0).toLocaleUpperCase() + compID.toLowerCase().slice(1)]

    if(!rowHeader)
    {
      return result;
    }
    const isID = !(typeof rowHeader === 'object')
    const head = comp.values.head;
    const tail = comp.values.tail;

    if(isID)
    { 
      result = parseInt(head[0]) === parseInt(rowHeader) ||  tail.some((v) => (parseInt(v.element[0]) === parseInt(rowHeader)))
    }
    else if (isNumeric)
    {
      result = parseInt(head[0]) === parseInt(rowHeader.value) ||  tail.some((v) => (parseInt(v.element[0]) === parseInt(rowHeader.value)))
    }
    else
    {
      result = head[0].toString().includes(rowHeader.value) ||  tail.some((v) => v.element[0].toString().includes(rowHeader.value))
    }
    return result;
  }

  type test = {
  [key in ASTKinds]?: (...args: any[]) => boolean;
};
 export const FSM: test = {
    [ASTKinds.comparison_1]: (row: Anime, statement: comparison_1, headers: TDataHeaders) => computeComp1(row, statement as comparison_1, headers),
    [ASTKinds.comparison_2]: (row: Anime, statement: comparison_2, headers: TDataHeaders) => computeComp2(row, statement as comparison_2, headers),
    [ASTKinds.comparison_3]: (row: Anime, statement: comparison_3) => true,
    [ASTKinds.statement_1]: (row: Anime, statement: statement_1, headers: TDataHeaders) => computeNot(row, statement.not as not_statement, headers),
    [ASTKinds.and_1]: (row: Anime, statement: and_1, headers: TDataHeaders) => computeAnd(row, statement as and_1, headers),
    [ASTKinds.or_1]: (row: Anime, statement: or_1, headers: TDataHeaders) => computeOr(row, statement as or_1, headers),

  }
  export const computeNot = (row: Anime, statement: not_statement,  headers: TDataHeaders): boolean => {
    
  
 
    return  !(FSM[statement.value.kind]?.(row, statement.value, headers) ?? false);

  }

export const computeAnd = (row: Anime, statement: and_1, headers: TDataHeaders ): boolean => {

   let resLeft =  FSM[statement.left.kind]?.(row, statement.left, headers) ?? false;
   let resRight =  FSM[statement.right.kind]?.(row, statement.right, headers) ?? false;
   
   return resLeft && resRight;

}

export const computeOr = (row: Anime, statement: or_1, headers: TDataHeaders ): boolean => {

  let resLeft =  FSM[statement.left.kind]?.(row, statement.left, headers) ?? false;
  let resRight =  FSM[statement.right.kind]?.(row, statement.right, headers) ?? false;
  
  return resLeft || resRight;

}

