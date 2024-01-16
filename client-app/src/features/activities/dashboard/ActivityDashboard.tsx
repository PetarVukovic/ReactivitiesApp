import { Grid } from "semantic-ui-react"
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import ActivityFilters from "./ActivityFilters";




export const ActivityDashboard = observer(() => {

    const { activityStore } = useStore();
    const { loadActivities, activityRegistry } = activityStore;

    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
    }, [loadActivities, activityRegistry.size]);


    if (activityStore.loadingInitial) return <LoadingComponents content='Loading activities...' inverted={false} />

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />

            </Grid.Column>
        </Grid>
    )
})
