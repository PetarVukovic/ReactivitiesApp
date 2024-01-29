import { User } from "./user";

export interface IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    followersCount: number;
    followingCount: number;
    following: boolean;
    photos?: IPhoto[];
}

export class Profile implements IProfile {
    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;

    }
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    followersCount = 0;
    followingCount = 0;
    following = false;
    photos?: IPhoto[];
}

export interface IPhoto {
    id: string;
    url: string;
    isMain: boolean;
}

