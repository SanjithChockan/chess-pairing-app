import { AgGridReact } from 'ag-grid-react'
import { useRef, useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnState, GridReadyEvent } from '@ag-grid-community/core'

export const Route = createFileRoute('/tournamentCompleteView/$tourneyName')({
  component: finalView
})

function finalView(): JSX.Element {
  const { tourneyName } = Route.useParams()
  const gridRef = useRef<AgGridReact>(null)
  const [playersList, setPlayersState] = useState([
    { firstName: '', lastName: '', rating: 0, score: 0 }
  ])
  const [rowData, setRowData] = useState(playersList)
  const [colDefs, setColDefs] = useState([
    { field: 'firstName' },
    { field: 'lastName' },
    { field: 'rating', sortable: true },
    { field: 'score', sortable: true }
  ])

  const onGridReady = useCallback(async (params: GridReadyEvent) => {
    console.log(`tourneyName in Current Standings ${tourneyName}`)
    const names = await window.api.getCurrentStandings(tourneyName)
    setPlayersState(names)
    setRowData(names)
    const defaultSortModel: ColumnState[] = [
      { colId: 'score', sort: 'desc', sortIndex: 0 },
      { colId: 'rating', sort: 'desc', sortIndex: 1 }
    ]
    params.api.applyColumnState({ state: defaultSortModel })
  }, [])

  return (
    <>
      <div>
        <h1>{tourneyName} Final Standings </h1>
      </div>
      <div className="ag-theme-quartz w-full" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection={'multiple'}
          onGridReady={onGridReady}
        />
      </div>
    </>
  )
}
