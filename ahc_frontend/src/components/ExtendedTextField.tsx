import { TextField } from '@mui/material';
import { HTMLInputTypeAttribute } from 'react';

const ExtendedTextField = ({
  label,
  type,
  placeholder,
  errors,
  onChange,
  required,
}: {
  label: string,
  type: HTMLInputTypeAttribute,
  placeholder: string,
  errors: string[],
  onChange: any,
  required: boolean
}) => (
  <TextField
    label={label}
    type={type}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    error={errors && errors.length > 0}
    helperText={errors && errors.length > 0 ? errors[0] : ''}
    required={required}
  />
);
export default ExtendedTextField;
