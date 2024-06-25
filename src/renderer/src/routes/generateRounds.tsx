import { createFileRoute } from '@tanstack/react-router'
import CardTournamentForm from '@renderer/@/components/displayTournaments/TournamentList'

export const Route = createFileRoute('/generateRounds')({
  component: generateRounds
})

function generateRounds(): JSX.Element {
  return (
    <>
      <div>
        <h1>Generate Rounds for Tournament Page</h1>
      </div>

      <CardTournamentForm />
    </>
  )
}
