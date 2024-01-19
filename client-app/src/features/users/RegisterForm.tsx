import { Formik, ErrorMessage } from 'formik'
import { observer } from 'mobx-react-lite'
import { Form } from 'react-router-dom'
import { Header, Button } from 'semantic-ui-react'
import MyTextInputs from '../../app/common/form/MyTextInputs'
import { useStore } from '../../app/stores/store'
import * as Yup from 'yup'
import ValidationError from '../errors/ValidationError'

const RegisterForm = observer(() => {

    const { userStore } = useStore();
    return (
        <Formik initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={(values,
                { setErrors }) => userStore.register(values).catch((error) => setErrors({ error }))}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required().email(),
                password: Yup.string().required()
            })}


        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>

                    <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign='center' />
                    <MyTextInputs name='email' placeholder='Email' />
                    <MyTextInputs name='displayName' placeholder='displayName' />
                    <MyTextInputs name='username' placeholder='username' />
                    <MyTextInputs name='password' placeholder='password' type='password' />
                    <ErrorMessage name='error' render={() =>
                        <ValidationError errors={errors.error as unknown as string[]} />} />
                    <Button
                        disabled={!isValid || !dirty || isSubmitting}
                        loading={isSubmitting}
                        positive content='Register'
                        type='submit' fluid />

                </Form>



            )}

        </Formik >
    )
})

export default RegisterForm
