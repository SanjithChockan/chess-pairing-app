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

  useEffect(() => {
    const f = async (): Promise<void> => {
      const names = await window.api.getPairings(tourneyName)
      setRowData(names)
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
        editable: true
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
    // set roundInProgress back to 0
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        onCellValueChanged={onCellValueChanged}
        immutableData={true}
        getRowId={(params) => params.data.match.toString()}
      />
      <Button onClick={handleComplete} className="mt-4">
        Complete Round
      </Button>
    </div>
  )
}
