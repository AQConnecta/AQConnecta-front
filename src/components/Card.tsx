import { Box } from '@mui/material'
import React from 'react'

type CardProps = {
    children: React.ReactNode
    sx?: object
}

function Card({ children, sx }: CardProps) {
  return (
    <Box
      sx={[{ boxShadow: '0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%)', backgroundColor: '#fff', borderRadius: '8px', padding: '16px', marginBottom: '16px' }, sx]}
    >
      {children}
    </Box>
  )
}

export default Card
