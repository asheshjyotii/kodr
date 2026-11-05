import { createContext } from "react";

// consumer
export let MyStore = createContext()

// provider
export const ContextProvider = ({children})=>{
    let data = "hello";

    return <MyStore.Provider value={data}>{children}</MyStore.Provider>
}