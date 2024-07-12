import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState } from 'react'


type propType = {
  tourneyName: string
}

export default function CurrentStandings({ tourneyName }: propType): JSX.Element {
  const gridRef = useRef<AgGridReact>(null)
  const [playersList, setPlayersState] = useState([{ firstName: '', lastName: '', rating: 0 }])
  const [rowData, setRowData] = useState(playersList)
  const [colDefs, setColDefs] = useState([
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'rating' }
  ])

  useEffect(() => {
    const f = async (): Promise<void> => {
      const names = await window.api.getPlayers(tourneyName)
      setPlayersState(names)
      setRowData(names)
      console.log('retrieved player data')
      console.log(`player names: ${names}`)
    }
    f()
  }, [])

  return (
    <>
      <div>
        <h1>{tourneyName} Standings Table</h1>
      </div>

      <div className="ag-theme-quartz w-full" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection={'multiple'}
        />
      </div>
    </>
  )
}
