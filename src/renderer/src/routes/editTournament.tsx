import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@renderer/@/components/ui/button'
import PlayerGrid from '@renderer/@/components/displayPlayers/PlayerTable'

type tournamentSearch = {
  tourneyName: string
}

export const Route = createFileRoute('/editTournament')({
  component: editTournament,
  validateSearch: (search: Record<string, unknown>): tournamentSearch => {
    // validate and parse the search params into a typed state
    return {
      tourneyName: (search.tourneyName as string) || ''
    }
  }
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
        <PlayerGrid tourneyName={tourneyName}></PlayerGrid>
      </div>
    </>
  )
}
