import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { ChangeEvent, useState } from "react";

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;

}

export const ActivityForm = ({ activity: selectedActivity, closeForm, createOrEdit }: Props) => {

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
        createOrEdit(activity);
    }
    function handleInputChanges(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target
        setActivity({ ...activity, [name]: value })
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}  >
                <Form.Input placeholder='Title' value={activity.title} name="title" onChange={handleInputChanges} />
                <Form.TextArea placeholder='Description' value={activity.description} name={activity.description} onChange={handleInputChanges} />
                <Form.Input placeholder='Category' value={activity.category} name="category" onChange={handleInputChanges} />
                <Form.Input placeholder='Date' value={activity.date} name="date" onChange={handleInputChanges} />
                <Form.Input placeholder='City' value={activity.city} name="city" onChange={handleInputChanges} />
                <Form.Input placeholder='Venue' value={activity.venue} name="venue" onChange={handleInputChanges} />
                <Button floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    );
}

