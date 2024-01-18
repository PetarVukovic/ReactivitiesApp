import { useField } from "formik";
import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import { Form, Label } from "semantic-ui-react";

//Ako ne stavimo Partial, onda ce nam traziti da prosledimo sve propertije iz ReactDatePickerProps koji nisu optional such as onChange, selected, etc.
const MyDateInput = (props: Partial<ReactDatePickerProps>) => {

    //matching field and meta to the useField hook.!! casting into boolean
    const [field, meta, helpers] = useField(props.name!);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <DatePicker
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}//if there is a value, we will convert it to a date object, if not, we will return null
                onChange={value => helpers.setValue(value)}

            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : (
                null
            )}


        </Form.Field>
    )
}

export default MyDateInput
