import TextField from '@mui/material/TextField'
import { DESIGN_STATUS, PROJECT_TYPES, fieldSx } from '../lib/form'
import SelectField from './SelectField'

export default function ProjectFields({ values, errors, update }) {
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

      <TextField
        variant="outlined"
        placeholder="company or brand name (optional)"
        value={values.company}
        onChange={update('company')}
        helperText=" "
        slotProps={{ htmlInput: { 'aria-label': 'Company or brand' } }}
        sx={fieldSx}
      />
      <SelectField
        placeholder="what do you want built?"
        options={PROJECT_TYPES}
        value={values.projectType}
        onChange={update('projectType')}
        error={errors.projectType}
        helperText={errors.projectType}
        ariaLabel="What do you want built"
      />

      <SelectField
        placeholder="do you have a design already? (optional)"
        options={DESIGN_STATUS}
        value={values.design}
        onChange={update('design')}
        ariaLabel="Design status"
      />
      <TextField
        variant="outlined"
        placeholder="websites you like — paste links (optional)"
        value={values.references}
        onChange={update('references')}
        helperText=" "
        slotProps={{ htmlInput: { 'aria-label': 'Reference links' } }}
        sx={fieldSx}
      />

      <TextField
        variant="outlined"
        placeholder="describe what you want from me"
        multiline
        minRows={4}
        value={values.requirements}
        onChange={update('requirements')}
        error={Boolean(errors.requirements)}
        helperText={
          errors.requirements ??
          'Plain words are fine — e.g. product pages, shopping cart, online payment, customer login, and an admin panel to add products myself.'
        }
        slotProps={{ htmlInput: { 'aria-label': 'Describe what you want' } }}
        sx={{ ...fieldSx, gridColumn: '1 / -1' }}
      />
    </>
  )
}
