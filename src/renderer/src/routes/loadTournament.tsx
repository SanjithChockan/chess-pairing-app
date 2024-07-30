import { createFileRoute } from '@tanstack/react-router'
import CardTournamentForm from '@renderer/@/components/displayTournaments/TournamentList'

export const Route = createFileRoute('/loadTournament')({
  component: loadTournament
})

function loadTournament(): JSX.Element {
  return (
    <>
      <div className="w-full">
        <div className="h-screen flex items-center justify-center">
          <CardTournamentForm />
        </div>
      </div>
    </>
  )
}
