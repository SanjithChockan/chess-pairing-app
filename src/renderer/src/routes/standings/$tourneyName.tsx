import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/standings/$tourneyName')({
  component: standingsTable
})

function standingsTable(): JSX.Element {
  const { tourneyName } = Route.useParams()

  return (
    <>
      <div>
        <h1>Standings Table for Tournament: {tourneyName}</h1>
      </div>
    </>
  )
}
