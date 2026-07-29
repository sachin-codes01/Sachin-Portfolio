import { createTheme } from '@mui/material/styles'

const ink = '#0b0b0b'
const flame = '#ff5522'

export const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: { main: ink, contrastText: '#ffffff' },
    secondary: { main: flame, contrastText: '#ffffff' },
    text: { primary: ink, secondary: 'rgba(11,11,11,0.6)' },
    background: { default: '#fbfaf7', paper: '#ffffff' },
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
          borderTop: '1px solid rgba(11,11,11,0.14)',
          '&::before': { display: 'none' },
          '&:last-of-type': { borderBottom: '1px solid rgba(11,11,11,0.14)' },
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
      styleOverrides: { paper: { borderRadius: 0, background: '#0b0b0b' } },
    },
  },
})

export default theme
