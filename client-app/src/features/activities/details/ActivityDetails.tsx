import { Button, Card, Image } from "semantic-ui-react"
import { Activity } from "../../../app/models/activity"
interface Props {
    activity: Activity;
    cancelSelectActivity: () => void;
    openForm: (id: string) => void;
}
export const ActivityDetails = (props: Props) => {
    return (
        <Card>
            <Image src={`/assets/categoryImages/${props.activity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{props.activity.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{props.activity.date}</span>

                </Card.Meta>
                <Card.Description>
                    {props.activity.description}
                </Card.Description>


            </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button onClick={() => props.openForm(props.activity.id)} basic color='blue' content='Edit' />
                    <Button onClick={props.cancelSelectActivity} basic color='grey' content='Cancel' />
                </Button.Group>
            </Card.Content>

        </Card>
    )
}