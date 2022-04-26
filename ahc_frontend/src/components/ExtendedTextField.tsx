import { TextField } from '@mui/material';
import { HTMLInputTypeAttribute } from 'react';

const ExtendedTextField = ({
  label,
  type,
  placeholder,
  errors,
  onChange,
}: {
  label: string,
  type: HTMLInputTypeAttribute,
  placeholder: string,
  errors: string[],
  onChange: any
}) => (
  <TextField
    label={label}
    type={type}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
    error={errors && errors.length > 0}
    helperText={errors && errors.length > 0 ? errors[0] : ''}
  />
);
export default ExtendedTextField;
