import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import commonStore from "./commonStore";
import userStore from "./userStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import CommentStore from "./commentStore";

interface Store {
    activityStore: ActivityStore;
    commonStore: commonStore;
    userStore: userStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
    commentStore?: CommentStore;
}

export const store: Store = {
    //Dodajemo nove storove kako dolaze i to ce biti dostupnu u react Contextu
    activityStore: new ActivityStore(),
    commonStore: new commonStore(),
    userStore: new userStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore()
}

export const StoreContext = createContext(store);


//Our custom hook koja vraca storeContext
export function useStore() {
    return useContext(StoreContext);
}