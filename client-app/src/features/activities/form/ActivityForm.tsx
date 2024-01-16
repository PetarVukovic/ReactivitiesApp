import { Button, Form, Segment } from "semantic-ui-react";
import { ChangeEvent, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";



export const ActivityForm = observer(() => {

    const { activityStore } = useStore();
    const { selectedActivity, closeForm, updateActivity, createActivity, loading } = activityStore;

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    };

    const [activity, setActivity] = useState(initialState);

    const handleSubmit = () => {
        activity.id ? updateActivity(activity) : createActivity(activity);

    }
    function handleInputChanges(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target
        setActivity({ ...activity, [name]: value })
    }

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
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    );
})

