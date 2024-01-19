import { ErrorMessage, Formik } from 'formik'
import { Button, Form, Header, Label } from 'semantic-ui-react'
import MyTextInputs from '../../app/common/form/MyTextInputs'
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';

const LoginForm = observer(() => {

    const { userStore } = useStore();
    return (
        <Formik initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore?.login(values).catch(() => setErrors({ error: 'Invalid email or password' }))}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>

                    <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center' />
                    <MyTextInputs name='email' placeholder='Email' />
                    <MyTextInputs name='password' placeholder='Password' type='password' />
                    <ErrorMessage name='error' render={() => <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />} />
                    <Button loading={isSubmitting} positive content='Login' type='submit' fluid />

                </Form>



            )}

        </Formik>
    )
})

export default LoginForm
