import { useState, useMemo } from 'react'
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
}
const resultOptions = [
  { value: '1-0', label: '1-0' },
  { value: '1/2-1/2', label: '1/2-1/2' },
  { value: '0-1', label: '0-1' }
]

function PairingView({ tourneyName, pairings }: propType): JSX.Element {
  // TODO: If pairing is None, check whether it the table for current_round exists and still in progress -> display

  const [rowData, setRowData] = useState(pairings)
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

  const onCellValueChanged = (params: any) => {
    if (params.column.colId === 'result') {
      const updatedPairings = rowData.map((p) =>
        p.match === params.data.match ? { ...p, result: params.newValue } : p
      )
      setRowData(updatedPairings)
    }
  }

  const handleComplete = async (): Promise<void> => {
    // Sending back results to backend for processing
    console.log('Completed round. -> send data back')
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

export default PairingView
