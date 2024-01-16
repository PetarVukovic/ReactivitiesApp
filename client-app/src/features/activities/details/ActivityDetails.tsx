import { Grid } from "semantic-ui-react"
import { useStore } from "../../../app/stores/store";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

export const ActivityDetails = observer(() => {

    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) loadActivity(id);
    }, [id, loadActivity]);

    if (loadingInitial || !activity) return <LoadingComponents inverted={true} content="Loading..." />;
    return (
        <Grid>
            <Grid.Column width={10}>

                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedChat />
                <ActivityDetailedInfo activity={activity} />

            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar />
            </Grid.Column>


        </Grid>

    )
})