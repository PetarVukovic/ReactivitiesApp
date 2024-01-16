import { Button, Card, Image } from "semantic-ui-react"
import { useStore } from "../../../app/stores/store";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import { observer } from "mobx-react-lite";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

export const ActivityDetails = observer(() => {

    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) loadActivity(id);
    }, [id, loadActivity]);

    if (loadingInitial || !activity) return <LoadingComponents inverted={true} content="Loading..." />;
    return (
        <Card >
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{activity.date}</span>

                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>


            </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content='Edit' />
                    <Button as={Link} to='/activities' basic color='grey' content='Cancel' />
                </Button.Group>
            </Card.Content>

        </Card>
    )
})