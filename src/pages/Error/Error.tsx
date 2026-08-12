import { Box } from "@mui/material"

function Error() {
  return (
    <Box height='100vh' sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <h1>Error 404</h1>
      <p>Page not found</p>
    </Box>
  )
}

export default Error
