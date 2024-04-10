import { Link, createFileRoute } from '@tanstack/react-router'
import TournamentForm from '@renderer/@/components/ui/TournamentForm'

export const Route = createFileRoute('/createTournament')({
  component: createTournament
})

function createTournament(): JSX.Element {
  return (
    <>
      <div>
        <h1>Create Tournament Page</h1>
      </div>

      <TournamentForm />

      <div>
        <Link to="/" className="[&.active]:font-bold">
          Back
        </Link>
      </div>
    </>
  )
}
