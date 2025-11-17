  // CustomSelect.jsx
  import * as React from 'react';
  import { useTheme } from '@mui/material/styles';
  import OutlinedInput from '@mui/material/OutlinedInput';
  import InputLabel from '@mui/material/InputLabel';
  import MenuItem from '@mui/material/MenuItem';
  import FormControl from '@mui/material/FormControl';
  import Select from '@mui/material/Select';

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 4;
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
    disabled = false, 
    startAdornment = null, 
    borderRadius = 4
  }) {
    const theme = useTheme();
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    onChange(selectedValue);
  };

    
    const getOptionValue = (option) => {
      if (typeof option === 'string') return option;
      return option?.value || option;
    };

    
    const getOptionLabel = (option) => {
      if (typeof option === 'string') return option;
      return option?.label || option?.value || option;
    };

    return (
       <FormControl 
       sx={{ 
        m: margin, 
        width: width,
        '& .MuiOutlinedInput-root': {
          borderRadius: borderRadius,
        } 
        }} 
        required={required}>
      <InputLabel 
        id={`custom-select-label-${label}`}
        sx={{
          left: startAdornment ? 3 : 0
        }}
        >{label}
        </InputLabel>
      <Select
        labelId={`custom-select-label-${label}`}
        id={`custom-select-${label}`}
        multiple={multiple}
        value={value || ''}
        onChange={handleChange}
        input={
          <OutlinedInput 
            label={label}
            startAdornment={startAdornment}
            sx={{
              pl: startAdornment ? 1 : 0
            }}
          />
        }
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