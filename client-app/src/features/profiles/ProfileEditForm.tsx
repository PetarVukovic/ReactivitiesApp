import { Formik } from 'formik'
import { Button, Form } from 'semantic-ui-react';
import * as Yup from 'yup';
import MyTextInputs from '../../app/common/form/MyTextInputs';
import MyTextArea from '../../app/common/form/MyTextArea';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';

interface Props {
    setEditMode: (editMode: boolean) => void;
}
const ProfileEditForm = observer(({ setEditMode }: Props) => {
    const { profileStore: { profile, updateProfile } } = useStore();
    const validationSchema = Yup.object({
        displayName: Yup.string().required()
    });
    return (
        <>
            <Formik
                initialValues={{
                    displayName: profile?.displayName, bio:
                        profile?.bio
                }}
                onSubmit={values => (updateProfile(values).then(() => {
                    setEditMode(false);
                }))} // updateProfile(values) is a promise
                validationSchema={validationSchema}
            >
                {({ isSubmitting, isValid, dirty }) => (
                    <Form className='ui form'>
                        <MyTextInputs name='displayName' placeholder='Display Name' />
                        <MyTextArea rows={3} name='bio' placeholder=' Add your Bio' />
                        <Button
                            loading={isSubmitting}
                            disabled={!isValid || !dirty}
                            floated='right'
                            type='submit'
                            size='large'
                            positive
                            content='Update profile'

                        />
                    </Form>
                )}


            </Formik>
        </>

    )
})

export default ProfileEditForm
