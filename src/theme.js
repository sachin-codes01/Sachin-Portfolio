import { createTheme } from '@mui/material/styles'

const ink = '#0b0b0b'
const paperLight = '#fbfaf7'
const inkDark = '#f2f0ea'
const paperDark = '#14130f'
const cardDark = '#1c1a15'
const flame = '#ff5522'

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: ink, contrastText: '#ffffff' },
        secondary: { main: flame, contrastText: '#ffffff' },
        text: { primary: ink, secondary: 'rgba(11,11,11,0.6)' },
        background: { default: paperLight, paper: '#ffffff' },
      },
    },
    dark: {
      palette: {
        primary: { main: inkDark, contrastText: '#0b0b0b' },
        secondary: { main: flame, contrastText: '#ffffff' },
        text: { primary: inkDark, secondary: 'rgba(242,240,234,0.6)' },
        background: { default: paperDark, paper: cardDark },
      },
    },
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif",
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.01em' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 26, paddingBlock: 12 },
      },
    },
    MuiAccordion: {
      defaultProps: { disableGutters: true, square: true, elevation: 0 },
      styleOverrides: {
        root: {
          background: 'transparent',
          borderTop: 'color-mix(in srgb, var(--mui-palette-text-primary) 14%, transparent) solid 1px',
          '&::before': { display: 'none' },
          '&:last-of-type': {
            borderBottom: 'color-mix(in srgb, var(--mui-palette-text-primary) 14%, transparent) solid 1px',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { paddingInline: 0, minHeight: 0 },
        content: { marginBlock: 0 },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: { root: { padding: 0 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '& fieldset': { border: 'none' },
          '&:hover fieldset, &.Mui-focused fieldset': { border: 'none' },
        },
        input: { padding: '14px 0' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: 14, letterSpacing: '0.02em' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 0, background: ink, fontSize: 11, letterSpacing: '0.08em' },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 0, background: ink, color: '#fff' } },
    },
  },
})

export default theme
