import { Link, createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

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
  // TODO: use tourneyName to query data from backend (load players and rounds)
  console.log(`tourneyName: ${tourneyName}`)

  const [playersList, setPlayersState] = useState([{ fn: '', ln: '' }])
  useEffect(() => {
    const f = async (): Promise<void> => {
      const names = await window.api.getPlayers(tourneyName)
      setPlayersState(names)
      console.log('retrieved player data')
      console.log(`player names: ${names}`)
    }
    f()
  }, [])

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
