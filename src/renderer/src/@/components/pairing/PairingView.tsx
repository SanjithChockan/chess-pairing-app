import { useState, useMemo, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { Button } from '@renderer/@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { useToast } from '@renderer/@/components/ui/use-toast'

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
  const { toast } = useToast()

  const [rowData, setRowData] = useState(pairings)
  const [roundInProgress, setRoundInProgress] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const f = async (): Promise<void> => {
      const names = await window.api.getPairings(tourneyName)
      setRowData(names)

      const isRoundInProgress = await window.api.getRoundInProgress(tourneyName)
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
        editable: (params) => params.data.player2 !== 'BYE'
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

    const areResultsFilled = await window.api.checkAllResultsFilled(tourneyName)
    if (!areResultsFilled) {
      // pop a message to user to fill up all values
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'enter all results before completing round!'
      })
    } else {
      await window.api.completeRound(tourneyName)
      // if tournament complete (check value in backend (invoke tournamentComplete function) - reroute to final page or just execute onCompleteRound())
      const isTourneyComplete = await window.api.checkTournamentComplete(tourneyName)
      if (isTourneyComplete) {
        navigate({
          to: '/tournamentCompleteView/$tourneyName',
          params: { tourneyName }
        })
      } else {
        onCompleteRound()
      }
    }
  }

  return (
    <div className="flex flex-col space-y-2">
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
    </div>
  )
}
