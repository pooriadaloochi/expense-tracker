import { InputAdornment, TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

export default function NumberFormatTextField({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  adornment = "ریال",
  ...props
}) {
  return (
    <NumericFormat
      value={value}
      thousandSeparator=","
      allowNegative={false}
      customInput={TextField}
      fullWidth
      label={label}
      name={name}
      error={Boolean(error)}
      helperText={helperText}
      onValueChange={(values) => {
        // Send only numeric value to parent form (not formatted string)
        onChange({
          target: {
            name,
            value: values.value,
          },
        });
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{adornment}</InputAdornment>
        ),
      }}
      {...props}
    />
  );
}
