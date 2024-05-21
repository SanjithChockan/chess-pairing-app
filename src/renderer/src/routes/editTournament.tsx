import { Link, createFileRoute } from '@tanstack/react-router'

type tournamentSearch = {
  tourneyName: string
}

export const Route = createFileRoute('/editTournament')({
  component: editTournament,
  validateSearch: (search: Record<string, unknown>): tournamentSearch => {
    // validate and parse the search params into a typed state
    return {
      tourneyName: (search.filter as string) || ''
    }
  }
})

function editTournament(): JSX.Element {
  const { tourneyName } = Route.useSearch()
  // TODO: use tourneyName to query data from backend (load players and rounds)
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
