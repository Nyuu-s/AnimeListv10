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
    [key: string]:  string[] | Anime;
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