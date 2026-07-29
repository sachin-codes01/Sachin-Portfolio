import { useEffect, useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { fieldSx } from '../lib/form'
import { onPageScroll } from '../lib/useSmoothScroll'

const SCROLL_SLOP = 8

const menuProps = {
  disableScrollLock: true,
  slotProps: {
    paper: {
      'data-lenis-prevent': true,
      sx: {
        maxHeight: 320,
        overflowY: 'auto',
        borderRadius: 0,
        boxShadow: '0 18px 44px rgba(11,11,11,0.14)',
        '& .MuiMenuItem-root': { fontSize: 14, paddingBlock: 1.25 },
        '& .MuiMenuItem-root.Mui-selected': {
          backgroundColor: 'rgba(255,85,34,0.1)',
          color: '#ff5522',
        },
        '& .MuiMenuItem-root.Mui-selected:hover': { backgroundColor: 'rgba(255,85,34,0.16)' },
      },
    },
  },
}

export default function SelectField({
  placeholder,
  options,
  value,
  onChange,
  error,
  helperText,
  ariaLabel,
  fullWidth = false,
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const from = window.scrollY
    return onPageScroll(() => {
      if (Math.abs(window.scrollY - from) > SCROLL_SLOP) setOpen(false)
    })
  }, [open])

  return (
    <TextField
      select
      variant="outlined"
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={helperText ?? ' '}
      sx={fullWidth ? { ...fieldSx, gridColumn: '1 / -1' } : fieldSx}
      slotProps={{
        htmlInput: { 'aria-label': ariaLabel },
        select: {
          displayEmpty: true,
          renderValue: (selected) => selected || <span className="text-ink/45">{placeholder}</span>,
          MenuProps: menuProps,
          open,
          onOpen: () => setOpen(true),
          onClose: () => setOpen(false),
        },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}
