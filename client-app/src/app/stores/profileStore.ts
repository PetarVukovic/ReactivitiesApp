import { makeAutoObservable, reaction, runInAction } from "mobx";
import { IPhoto, IUserActivity, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loadaing = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;
    useractivities: IUserActivity[] = [];
    loadingActivities = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    setActiveTab = (activeTab: number) => {
        this.activeTab = activeTab;

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

    updateProfile = async (profile: Partial<Profile>) => {
        try {
            this.loadaing = true;
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                //Trebamo updateati i user store jer se tamo nalazi display name
                if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }
                this.profile = { ...this.profile, ...profile as Profile };
                this.loadaing = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() => { this.loadaing = false; })


        }
    }

    //     Now the idea of this second property, the following property, we're going to use this as what we're

    // about to set the following status to.

    // So it's not the current status of their following.

    // It's what we're going to do when we click on this button.

    updateFollowing = async (username: string, following: boolean) => {
        this.loadaing = true;
        try {
            await agent.Profiles.updateFollowing(username);
            //Update our attendees
            store.activityStore.updateAttendeeFollowing(username);
            //runinAction because we need to update our observable in the store
            runInAction(() => {

                //if statment is to check if we are on the profile page and 
                //if we are on the profile page we want to update the following status of the profile that we're looking at
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username !== username) {
                    // if following is true we want to increment the followers count by one, if it's false we want to decrement it by one
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    //update the following status
                    this.profile.following = !this.profile.following;

                }

                if (this.profile && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;

                }

                //When following chamnges we want to update the followings array
                //We want to update the following status of the profile that we're looking at
                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })

                this.loadaing = false;

            })

        } catch (error) {
            console.log(error);
            runInAction(() => { this.loadaing = false; })


        }


    }

    //We don't need the username because we're only going to be viewing a user's list of followers or followings
    // when they're on a particular user's profile page.
    loadFollowings = async (predicate: string) => {

        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() => { this.loadingFollowings = false; })

        }



    }
    loadUserActivities = async (username: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            const useractivities = await agent.Profiles.listActivities(username, predicate!);
            runInAction(() => {
                this.useractivities = useractivities;
                this.loadingActivities = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() => { this.loadingActivities = false; })

        }
    }

}