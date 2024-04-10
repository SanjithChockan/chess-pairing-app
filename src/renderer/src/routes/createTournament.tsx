import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/createTournament')({
  component: createTournament,
})

function createTournament(): JSX.Element {
  return (
    <>
      <div>
        <h1>Create Tournament Page</h1>
      </div>
      <div>
        <Link to="/" className="[&.active]:font-bold">
          Back
        </Link>
      </div>
    </>
  )
}