import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export default function Notice({ open, onClose, children }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ top: { xs: 68, md: 76 } }}
    >
      <Alert
        severity="success"
        variant="filled"
        icon={false}
        onClose={onClose}
        sx={{
          borderRadius: 0,
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
          fontSize: 14,
          letterSpacing: '0.01em',
          boxShadow: '0 14px 34px rgba(11,11,11,0.18)',
          '& .MuiAlert-action': { color: 'inherit' },
        }}
      >
        {children}
      </Alert>
    </Snackbar>
  )
}
