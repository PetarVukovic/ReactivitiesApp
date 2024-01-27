/* eslint-disable react-refresh/only-export-components */
import { observer } from 'mobx-react-lite'
import { Segment, Header, Comment, Loader } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';

interface Props {
    activityId: string;

}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
    const { commentStore } = useStore();
    useEffect(() => {
        //This method is likely responsible for creating a SignalR hub connection for the given activity. 
        //The ?. operator is used to ensure that createHubConnection is only called if commentStore is not null or undefined.
        if (activityId) commentStore?.createHubConnection(activityId);
        return () => {
            commentStore?.clearComments();
        }

    }, [commentStore, activityId]);

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Formik
                    onSubmit={(values, { resetForm }) => commentStore?.addComments(values).then(() => resetForm())}
                    initialValues={{ body: '' }}
                    validationSchema={Yup.object({
                        body: Yup.string().required()

                    })}
                >
                    {({ isSubmitting, isValid }) => (

                        <Form className='ui form' >
                            <Field name='body'>
                                {(props: FieldProps) => (
                                    <div style={{ position: 'relative' }}>
                                        <Loader active={isSubmitting} />
                                        <textarea
                                            placeholder='Enter you comment (Enter to submit, SHIFT + Enter for new line)'
                                            rows={2}
                                            {...props.field}//Props.field is an object that contains the value and onChange event handler for the field etc..
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && e.shiftKey) {
                                                    return;
                                                }
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();//we prevent the default behaviour of the enter key which is to submit the form
                                                    isValid && props.form.submitForm();//we check if the form is valid before submitting it
                                                }
                                            }}
                                        />

                                    </div>
                                )}

                            </Field>

                        </Form>

                    )}

                </Formik>
                <Comment.Group>
                    <Comment>
                        {commentStore?.comments.map(comment => (
                            <Comment key={comment.id}>
                                <Comment.Avatar src={comment.image || '/assets/user.png'} />
                                <Comment.Content>
                                    <Comment.Author as={Link}
                                        to={`/profiles/${comment.username}`}>{comment.displayName}</Comment.Author>
                                    <Comment.Metadata>
                                        <div>{formatDistanceToNow(comment.createdAt)}</div>
                                    </Comment.Metadata>
                                    <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
                                </Comment.Content>
                            </Comment>

                        ))}
                    </Comment>



                </Comment.Group>
            </Segment>
        </>

    )
})