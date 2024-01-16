import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store {
    activityStore: ActivityStore
}

export const store: Store = {
    //Dodajemo nove storove kako dolaze i to ce biti dostupnu u react Contextu
    activityStore: new ActivityStore()
}

export const StoreContext = createContext(store);


//Our custom hook koja vraca storeContext
export function useStore() {
    return useContext(StoreContext);
}