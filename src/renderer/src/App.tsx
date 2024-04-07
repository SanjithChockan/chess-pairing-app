import { Button } from './@/components/ui/button'
import { RouterProvider, createRouter } from '@tanstack/react-router'



// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App(): JSX.Element {
  return (
    <>
      <div>
        <h1>Tournament Manager</h1>
      </div>
      <div>
        <Button variant="outline" size="lg">
          Create Tournament
        </Button>
        <Button variant="outline" size="lg">
          Load Tournament
        </Button>
      </div>
    </>
  )
}

export default App
