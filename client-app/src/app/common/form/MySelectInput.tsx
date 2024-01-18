import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    options: { text: string, value: string }[];
    label?: string;

}
const MySelectInput = (props: Props) => {

    //matching field and meta to the useField hook.!! casting into boolean,_ we are not using first param.
    /*
    The provided code is a custom select input component for a form in a React application using TypeScript. It uses the Formik library for form state management and the Semantic UI library for UI components. Here's a breakdown of what's happening:

1. **Imports**: The necessary modules and components are imported. These include `useField` from Formik for form field state management, and `Form`, `Label`, and `Select` from Semantic UI for the form UI.

2. **Props Interface**: An interface named `Props` is defined to specify the types of the props that the `MySelectInput` component will accept. These props include `placeholder`, `name`, `options`, and `label`.

3. **MySelectInput Component**: This is a functional component that takes an object of props as defined by the `Props` interface. Inside this component, the `useField` hook from Formik is used to manage the state of the form field.

4. **useField Hook**: The `useField` hook is called with the `name` prop. It returns an array with three elements: `field`, `meta`, and `helpers`. `field` contains the `value` and `onChange` and `onBlur` handlers for the field. `meta` contains information about the field's state, such as whether it has been touched and whether there are any errors. `helpers` contains functions to manually change the field's value and touched state.

5. **Form.Field Component**: This is a Semantic UI component that wraps the select input. It takes an `error` prop which is `true` if the field has been touched and there is an error.

6. **Select Component**: This is the actual select input. It takes several props, including `options` for the select options, `value` for the current value, `onChange` to update the value when it changes, `onBlur` to mark the field as touched when it loses focus, and `placeholder` for the placeholder text.

7. **Error Message**: If the field has been touched and there is an error, a `Label` component is rendered with the error message.

8. **Export**: Finally, the `MySelectInput` component is exported as the default export of this module.

The cursor is currently on line 26, which is where the `onChange` prop is being set on the `Select` component. This prop is a function that calls the `setValue` helper from Formik with the new value when the select input changes.
    */
    const [field, meta, helpers] = useField(props.name);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select clearable
                options={props.options}
                value={field.value || null}
                onChange={(_, data) => helpers.setValue(data.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : (
                null
            )}


        </Form.Field>
    )
}

export default MySelectInput
