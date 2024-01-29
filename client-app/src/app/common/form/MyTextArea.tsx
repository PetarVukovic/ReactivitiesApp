import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props {
    placeholder: string;
    name: string;
    rows: number;
    label?: string;
}

const MyTextArea = (props: Props) => {
    const [field, meta] = useField(props.name!);
    const label = props.label || ""; // Add a default value for props.label

    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{label}</label>
            <textarea {...field} {...props} />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : (
                null
            )}
        </Form.Field>
    )
}


export default MyTextArea
