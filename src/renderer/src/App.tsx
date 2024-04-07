import { Button } from '@renderer/@/components/ui/button'

function App(): JSX.Element {
  return (
    <>
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
