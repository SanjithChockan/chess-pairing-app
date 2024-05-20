import { Link, createFileRoute } from '@tanstack/react-router'
import CardTournamentForm from '@renderer/@/components/displayTournaments/TournamentList'

export const Route = createFileRoute('/loadTournament')({
  component: loadTournament
})

function loadTournament(): JSX.Element {
  return (
    <>
      <div>
        <h1>Load Tournament Page</h1>
      </div>

      <CardTournamentForm />
    </>
  )
}
