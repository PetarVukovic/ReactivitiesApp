import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import commonStore from "./commonStore";

interface Store {
    activityStore: ActivityStore;
    commonStore: commonStore;
}

export const store: Store = {
    //Dodajemo nove storove kako dolaze i to ce biti dostupnu u react Contextu
    activityStore: new ActivityStore(),
    commonStore: new commonStore()
}

export const StoreContext = createContext(store);


//Our custom hook koja vraca storeContext
export function useStore() {
    return useContext(StoreContext);
}