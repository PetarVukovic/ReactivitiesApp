import { makeAutoObservable, runInAction } from "mobx";
import { IPhoto, IProfile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: IProfile | null = null;
    loadingProfile = false;
    uploading = false;
    loadaing = false;

    constructor() {
        makeAutoObservable(this);
    }

    //Get in Mobx is used to get a property from the store
    get isCurrentUser() {
        //we can check to see if we have both the userin the user store and the profile in the profile store
        if ((store.userStore.user && this.profile) && store.userStore.user.username === this.profile.username) {
            return true;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })


        } catch (error) {
            console.log(error);
        }

    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const respoonse = await agent.Profiles.uploadPhoto(file);
            const photo = respoonse.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            })



        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.uploading = false;
            })


        }
    }

    setMainPhoto = async (photo: IPhoto) => {
        this.loadaing = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(a => a.isMain)!.isMain = false;//find the photo that is currently set to main and set it to false
                    this.profile.photos.find(a => a.id === photo.id)!.isMain = true;//find the photo that we want to set to main and set it to true
                    this.profile.image = photo.url;//set the profile image to the photo that we want to set to main
                    this.loadaing = false;
                }
            })

        } catch (error) {

            runInAction(() => {
                this.loadaing = false;
                console.log(error);
            })


        }

    }

    deletePhoto = async (photo: IPhoto) => {
        this.loadaing = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(x => x.id !== photo.id);
                    this.loadaing = false;
                }
            })

        } catch (error) {
            runInAction(() => { this.loadaing = false; })
            console.log(error);

        }

    }

}