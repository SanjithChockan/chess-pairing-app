import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tournamentCompleteView/$tourneyName')({
  component: finalView
})

function finalView(): JSX.Element {
  const { tourneyName } = Route.useParams()

  return (
    <>
      <div>
        <h1>{tourneyName} completeTournamentView Page </h1>
      </div>
    </>
  )
}
