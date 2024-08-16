import { AgGridReact } from 'ag-grid-react'
import { useRef, useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnState, GridReadyEvent } from '@ag-grid-community/core'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@renderer/@/components/ui/button'

export const Route = createFileRoute('/tournamentCompleteView/$tourneyName')({
  component: finalView
})

function finalView(): JSX.Element {
  const navigate = useNavigate()
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
    const names = await window.api.getCurrentStandings(tourneyName)
    setPlayersState(names)
    setRowData(names)
    const defaultSortModel: ColumnState[] = [
      { colId: 'score', sort: 'desc', sortIndex: 0 },
      { colId: 'rating', sort: 'desc', sortIndex: 1 }
    ]
    params.api.applyColumnState({ state: defaultSortModel })
  }, [])

  const handleDelete = async (): Promise<void> => {
    // call delete function from api
    await window.api.deleteTournament(tourneyName)
    navigate({
      to: '/'
    })
  }

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex flex-col space-y-4 w-3/5">
        <div className="flex justify-between">
          <div>
            <p className="text-2xl">{tourneyName} Final Standings</p>
          </div>
          <div>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Tournament
            </Button>
          </div>
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
        <div className="flex justify-end">
          <Link to="/">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
