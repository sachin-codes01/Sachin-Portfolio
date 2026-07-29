import TextField from '@mui/material/TextField'
import { GOALS, ROLES, fieldSx } from '../lib/form'
import SelectField from './SelectField'

export default function CollabFields({ values, errors, update }) {
  return (
    <>
      <TextField
        variant="outlined"
        placeholder="your name"
        value={values.name}
        onChange={update('name')}
        error={Boolean(errors.name)}
        helperText={errors.name ?? ' '}
        slotProps={{ htmlInput: { 'aria-label': 'Your name' } }}
        sx={fieldSx}
      />
      <TextField
        variant="outlined"
        type="email"
        placeholder="your email"
        value={values.email}
        onChange={update('email')}
        error={Boolean(errors.email)}
        helperText={errors.email ?? ' '}
        slotProps={{ htmlInput: { 'aria-label': 'Your email' } }}
        sx={fieldSx}
      />

      <SelectField
        placeholder="what do you do?"
        options={ROLES}
        value={values.role}
        onChange={update('role')}
        ariaLabel="What do you do"
      />
      <SelectField
        placeholder="what are you looking for?"
        options={GOALS}
        value={values.goal}
        onChange={update('goal')}
        error={errors.goal}
        helperText={errors.goal}
        ariaLabel="What are you looking for"
      />

      <TextField
        variant="outlined"
        placeholder="your stack — React, Node, Figma… (optional)"
        value={values.stack}
        onChange={update('stack')}
        helperText=" "
        slotProps={{ htmlInput: { 'aria-label': 'Your stack' } }}
        sx={fieldSx}
      />
      <TextField
        variant="outlined"
        placeholder="GitHub or portfolio link (optional)"
        value={values.links}
        onChange={update('links')}
        helperText=" "
        slotProps={{ htmlInput: { 'aria-label': 'GitHub or portfolio link' } }}
        sx={fieldSx}
      />

      <TextField
        variant="outlined"
        placeholder="describe what you want to build together"
        multiline
        minRows={4}
        value={values.message}
        onChange={update('message')}
        error={Boolean(errors.message)}
        helperText={errors.message ?? 'Or what you are learning right now, and what you want to get better at.'}
        slotProps={{ htmlInput: { 'aria-label': 'Describe what you want to build' } }}
        sx={{ ...fieldSx, gridColumn: '1 / -1' }}
      />
    </>
  )
}
