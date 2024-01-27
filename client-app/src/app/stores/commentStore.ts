import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            //We ll need to pass the token to the server to authenticate the user
            //We ll need to pass the activityId to the server so that it knows which group to add the user to
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token as string
                })

                .withAutomaticReconnect()//This will automatically reconnect the client to the server if the connection is lost
                .configureLogging(LogLevel.Information)//This will log information to the console
                .build();

            this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error));//This will start the connection
            //When we establish the connection, we need to listen for the message that is sent from the server
            /*
            Then what we'll do is we'll just manually append the Z and we'll just add the comment dot Createdat

            plus Z and then any comments we receive in the load comments method.

            We're getting these directly from our database.

            Our receive comment we already know is coming not from our database but from our signal, our hub.

            So it has the Z appended already.
            */
            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {


                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + 'Z');


                    });
                    this.comments = comments;
                })

                //ReciveComment is coming from sin

                this.hubConnection?.on('ReceiveComment', (comment: ChatComment) => {
                    runInAction(() => {

                        comments.forEach(comment => {
                            comment.createdAt = new Date(comment.createdAt);


                        });

                        this.comments.unshift(comment);
                    })
                })

            });


        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

    //Clear the comments array when we navigate away from the activity
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComments = async (values: { body: string, activityId?: string }) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke('SendComment', values);//invoking method on server side and passing values
        } catch (error) {
            console.log(error);
        }
    }

}