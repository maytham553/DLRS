import { Box } from '@chakra-ui/react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import routes from './routes'

// AppRoutes component to use the useRoutes hook
function AppRoutes() {
  const element = useRoutes(routes)
  return element
}

function App() {
  return (
    <Box width="full">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Box>
  )
}

export default App
