import { AgGridReact } from 'ag-grid-react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@renderer/@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'

type propType = {
  tourneyName: string
  onGeneratePairings: () => void
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
    { field: 'rating' },
    { field: 'score' }
  ])

  useEffect(() => {
    const f = async (): Promise<void> => {
      const names = await window.api.getCurrentStandings(tourneyName)
      setPlayersState(names)
      setRowData(names)
      console.log('retrieved current standings data')
      console.log(`standings player names: ${names}`)
    }
    f()
  }, [])

  const navigate = useNavigate()

  const generatePairings = useCallback(async () => {
    // getting pairing data to display... pass to onGeneratePairings to display on pairing tab
    await window.api.generatePairings(tourneyName)
    onGeneratePairings()
  }, [tourneyName, navigate])

  return (
    <>
      <div className="ag-theme-quartz w-full" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection={'multiple'}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
          onClick={generatePairings}
        >
          Generate Pairings
        </Button>
      </div>
    </>
  )
}
