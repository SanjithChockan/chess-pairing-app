import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editTournament')({
  component: editTournament
})

function editTournament(): JSX.Element {
  const { tourneyName } = Route.useSearch()
  console.log(`tourneyName: ${tourneyName}`)
  return (
    <>
      <div>
        <h1>Edit Tournament Page</h1>
      </div>

      <div>
        <Link to="/" className="[&.active]:font-bold">
          Back
        </Link>
      </div>
    </>
  )
}
