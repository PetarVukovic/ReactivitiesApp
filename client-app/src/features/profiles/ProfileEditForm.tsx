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
    return (
        <>
            <Formik
                initialValues={{
                    displayName: profile?.displayName,
                    bio: profile?.bio || ''
                }}
                onSubmit={values => {
                    updateProfile(values).then(() => {
                        setEditMode(false);
                    })
                }}
                validationSchema={Yup.object({
                    displayName: Yup.string().required()
                })} >
                {({ isSubmitting, isValid, dirty }) => (
                    <Form className='ui form'>
                        <MyTextInputs
                            placeholder='Display Name'
                            name='displayName'
                        />
                        <MyTextArea rows={3} placeholder='Add your bio' name='bio' />
                        <Button
                            positive
                            type='submit'
                            loading={isSubmitting}
                            content='Update profile'
                            floated='right'
                            disabled={!isValid || !dirty}
                        />
                    </Form>
                )}
            </Formik>
        </>

    )
})

export default ProfileEditForm
