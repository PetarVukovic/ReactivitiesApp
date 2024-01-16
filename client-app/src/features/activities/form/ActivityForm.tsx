import { Button, Form, Segment } from "semantic-ui-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import { v4 as uuid } from "uuid";



export const ActivityForm = observer(() => {

    const { activityStore } = useStore();
    const { updateActivity, createActivity, loading, loadActivity, loadingInitial } = activityStore;

    const { id } = useParams();
    const navigate = useNavigate();


    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''


    });

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!));
    }, [id, loadActivity]);

    const handleSubmit = () => {
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }
    }
    function handleInputChanges(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target
        setActivity({ ...activity, [name]: value })
    }

    if (loadingInitial) return <LoadingComponents content='Loading activity...' inverted={true} />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}  >
                <Form.Input placeholder='Title' value={activity.title} name="title" onChange={handleInputChanges} />
                <Form.TextArea placeholder='Description' value={activity.description} name="DESCRIPTION" onChange={handleInputChanges} />
                <Form.Input placeholder='Category' value={activity.category} name="category" onChange={handleInputChanges} />
                <Form.Input type="date" placeholder='Date' value={activity.date} name="date" onChange={handleInputChanges} />
                <Form.Input placeholder='City' value={activity.city} name="city" onChange={handleInputChanges} />
                <Form.Input placeholder='Venue' value={activity.venue} name="venue" onChange={handleInputChanges} />
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    );
})

