import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { Button } from '@renderer/@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/@/components/ui/select'

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

function PairingView({ tourneyName, pairings }: propType): JSX.Element {
  const [rowData, setRowData] = useState(pairings)
  const columnDefs = [
    { headerName: 'Match', field: 'match', width: 100 },
    { headerName: 'Player 1', field: 'player1', width: 150 },
    {
      headerName: 'Result',
      field: 'result',
      width: 150,
      cellRenderer: 'resultSelector',
      cellRendererParams: {
        onChange: (data: Pairing, value: string): void => {
          console.log('updating value on table')
          const updatedPairings = pairings.map((p) =>
            p.match === data.match ? { ...p, result: value } : p
          )
          setRowData(updatedPairings)
        }
      }
    },
    { headerName: 'Player 2', field: 'player2', width: 150 }
  ]

  const ResultSelector = (props: any): JSX.Element => {
    const options = ['1-0', '1/2-1/2', '0-1']
    return (
      <Select onValueChange={(value) => props.onChange(props.data, value)}>
        <SelectTrigger>
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
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
        components={{
          resultSelector: ResultSelector
        }}
      />
      <Button onClick={handleComplete} className="mt-4">
        Complete Round
      </Button>
    </div>
  )
}

export default PairingView
