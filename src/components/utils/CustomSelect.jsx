// CustomSelect.jsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(item, selectedValue, theme) {
  return {
    fontWeight: selectedValue === item
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function CustomSelect({
  label = "Seleccionar",
  options = [],
  value,
  onChange,
  multiple = false,
  width = 300,
  margin = 1,
  required = false,
  disabled = false
}) {
  const theme = useTheme();

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    onChange(selectedValue);
  };

  // Función segura para obtener el valor de una opción
  const getOptionValue = (option) => {
    if (typeof option === 'string') return option;
    return option?.value || option;
  };

  // Función segura para obtener el label de una opción
  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    return option?.label || option?.value || option;
  };

  return (
    <FormControl sx={{ m: margin, width: width }} required={required}>
      <InputLabel id={`custom-select-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`custom-select-label-${label}`}
        id={`custom-select-${label}`}
        multiple={multiple}
        value={value || ''} // Asegurar que no sea undefined
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        MenuProps={MenuProps}
        disabled={disabled}
      >
        {options.map((option, index) => {
          const optionValue = getOptionValue(option);
          const optionLabel = getOptionLabel(option);
          
          return (
            <MenuItem
              key={optionValue || index}
              value={optionValue}
              style={getStyles(optionValue, value, theme)}
            >
              {optionLabel}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}