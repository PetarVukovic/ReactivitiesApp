import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class commonStore {
    error: ServerError | null = null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        //Stavit cemo reaction kako bi reagoirali na promjenu tokena
        //Postoje dva tipa reactiona, prvi je kada se nesto promijeni ali nece incijalno reagirat.
        // when we log in we want to set the token and reaction will make this happen and log out also 
        //if we use autorun it will happen when the store is created tj. incijalno ce se desit
        reaction(
            () => this.token,
            token => {
                if (token) {
                    localStorage.setItem('jwt', token);
                } else {
                    localStorage.removeItem('jwt');
                }
            }
        )


    }

    setServerError = (error: ServerError) => {
        this.error = error;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}