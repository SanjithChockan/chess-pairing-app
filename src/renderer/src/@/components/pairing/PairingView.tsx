import { useState, useMemo, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { Button } from '@renderer/@/components/ui/button'

interface Pairing {
  match: number
  player1: string
  player2: string
  result?: string
}
type propType = {
  tourneyName: string
  pairings: object[]
  onCompleteRound: () => void
}
const resultOptions = [
  { value: '1-0', label: '1-0' },
  { value: '1/2-1/2', label: '1/2-1/2' },
  { value: '0-1', label: '0-1' }
]

export default function PairingView({
  tourneyName,
  pairings,
  onCompleteRound
}: propType): JSX.Element {
  // TODO: If clicked on pairing tab than generate from standings, check whether the table tourneyName_round_current exists -> display matches
  // If roundInProgress=1, don't gray out 'Complete' button
  // else gray out

  const [rowData, setRowData] = useState(pairings)
  const [roundInProgress, setRoundInProgress] = useState(false)

  useEffect(() => {
    const f = async (): Promise<void> => {
      const names = await window.api.getPairings(tourneyName)
      setRowData(names)

      const isRoundInProgress = await window.api.getRoundInProgress(tourneyName)
      console.log(`isRoundInProgress: ${isRoundInProgress}`)
      setRoundInProgress(isRoundInProgress)
    }
    f()
  }, [])

  const columnDefs = useMemo(
    () => [
      { headerName: 'Match', field: 'match', width: 100 },
      { headerName: 'Player 1', field: 'player1', width: 150 },
      {
        headerName: 'Result',
        field: 'result',
        width: 150,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: resultOptions.map((option) => option.value)
        },
        editable: (params) => params.data.player2 !== 'BYE',
      },
      { headerName: 'Player 2', field: 'player2', width: 150 }
    ],
    []
  )

  const onCellValueChanged = async (params: any): Promise<void> => {
    if (params.column.colId === 'result') {
      const updatedPairings = rowData.map((p) =>
        p.match === params.data.match ? { ...p, result: params.newValue } : p
      )
      setRowData(updatedPairings)
      // update result value in backend
      await window.api.updateMatchResult(tourneyName, params.data.match, params.newValue)
    }
  }

  const handleComplete = async (): Promise<void> => {
    // Invoke backend to compute results
    // For future - add check to ensure all results are in
    // return false if not and notify user to input all results before completing
    // or gray out until all results are in - get value each time user enters a result
    await window.api.completeRound(tourneyName)
    onCompleteRound()
  }

  return (
    <>
      <div className="ag-theme-quartz w-full" style={{ height: 500 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          onCellValueChanged={onCellValueChanged}
          immutableData={true}
          getRowId={(params) => params.data.match.toString()}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleComplete}
          variant="outline"
          className={`bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 ${!roundInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!roundInProgress}
        >
          Complete Round
        </Button>
      </div>
    </>
  )
}
