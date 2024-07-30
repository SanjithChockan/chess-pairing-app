import { createFileRoute } from '@tanstack/react-router'
import TournamentForm from '@renderer/@/components/tournamentregistration/TournamentForm'

export const Route = createFileRoute('/createTournament')({
  component: createTournament
})

function createTournament(): JSX.Element {
  return (
    <>
      <div className="w-full">
        <div className="h-screen flex items-center justify-center">
          <TournamentForm />
        </div>
      </div>
    </>
  )
}
