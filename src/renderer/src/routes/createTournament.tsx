import { createFileRoute } from '@tanstack/react-router'
import TournamentForm from '@renderer/@/components/tournamentregistration/TournamentForm'

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
    </>
  )
}
