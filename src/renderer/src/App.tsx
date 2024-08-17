import { createHashHistory, RouterProvider, createRouter } from '@tanstack/react-router'
import { Toaster } from '@renderer/@/components/ui/toaster'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

const hashHistory = createHashHistory()
// Create a new router instance
const router = createRouter({ routeTree, history: hashHistory })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App(): JSX.Element {
  return (
    <>
      <Toaster></Toaster>
      <RouterProvider router={router} />
    </>
  )
}

export default App
