type propType = {
  tourneyName: string
}

export default function CurrentStandings({ tourneyName }: propType): JSX.Element {
  return (
    <>
      <div>
        <h1>{tourneyName} Standings Table</h1>
      </div>
    </>
  )
}
