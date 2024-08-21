import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close'

type CustomDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    actions?: React.ReactNode;
}

function CustomDialog({ isOpen, onClose, children, title, actions }: CustomDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      {actions}
    </Dialog>
  );
}

export default CustomDialog
