import { Button } from '@renderer/@/components/ui/button'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index
})

function Index(): JSX.Element {
  return (
    <>
      <div>
        <h1>Tournament Manager</h1>
      </div>
      <div>
        <Link to="/createTournament">
          <Button variant="outline" size="lg">
            Create Tournament
          </Button>
        </Link>

        <Link to="/loadTournament">
          <Button variant="outline" size="lg">
            Load Tournament
          </Button>
        </Link>
      </div>
    </>
  )
}
