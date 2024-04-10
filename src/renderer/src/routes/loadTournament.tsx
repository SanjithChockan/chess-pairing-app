import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/loadTournament')({
  component: loadTournament
})

function loadTournament(): JSX.Element {
  return (
    <>
      <div>
        <h1>Load Tournament Page</h1>
      </div>
      <div>
        <Link to="/" className="[&.active]:font-bold">
          Back
        </Link>
      </div>
    </>
  )
}
