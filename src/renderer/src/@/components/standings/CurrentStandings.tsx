import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@renderer/@/components/ui/button'
import { Link, useNavigate } from '@tanstack/react-router'
import { ColumnState, GridReadyEvent } from '@ag-grid-community/core'

type propType = {
  tourneyName: string
  onGeneratePairings: (data) => void
}

export default function CurrentStandings({
  tourneyName,
  onGeneratePairings
}: propType): JSX.Element {
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
  const [roundInProgress, setRoundInProgress] = useState(false)

  useEffect(() => {
    const f = async (): Promise<void> => {
      const isRoundInProgress = await window.api.getRoundInProgress(tourneyName)
      setRoundInProgress(isRoundInProgress)
    }
    f()
  }, [])

  const navigate = useNavigate()
  const generatePairings = useCallback(async () => {
    // getting pairing data to display... pass to onGeneratePairings to display on pairing tab
    await window.api.generatePairings(tourneyName)
    onGeneratePairings([])
  }, [tourneyName, navigate])

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
  return (
    <div className="flex flex-col space-y-2">
      <div className="ag-theme-quartz w-full" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection={'multiple'}
          onGridReady={onGridReady}
        />
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          className={`bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 ${roundInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={generatePairings}
          disabled={roundInProgress}
        >
          Generate Pairings
        </Button>

        <Link to="/">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    </div>
  )
}
