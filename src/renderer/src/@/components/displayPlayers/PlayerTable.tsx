import { AgGridReact } from 'ag-grid-react'
import { useCallback, useEffect, useState, useRef } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { Button } from '@renderer/@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@renderer/@/components/ui/dialog'
import { Input } from '@renderer/@/components/ui/input'
import { Label } from '@renderer/@/components/ui/label'
import { Link, useNavigate } from '@tanstack/react-router'
import { useToast } from '@renderer/@/components/ui/use-toast'

type propType = {
  tourneyName: string
}

export default function PlayerGrid({ tourneyName }: propType): JSX.Element {
  const { toast } = useToast()
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
    }
    f()
  }, [])

  const navigate = useNavigate()
  const completeRegistration = useCallback(async () => {
    // only complete if more than 2 or more players are registered
    const names = await window.api.getPlayers(tourneyName)
    if (names.length >= 2) {
      await window.api.completeRegistration(tourneyName)
      navigate({
        to: '/roundGenView/$tourneyName',
        params: { tourneyName: tourneyName }
      })
    } else {
      toast({
        title: 'Minimum Player Requirement',
        description: `Tournament needs at least two players...`
      })
    }
  }, [tourneyName, navigate])

  const handleDelete = async (): Promise<void> => {
    // call delete function from api
    await window.api.deleteTournament(tourneyName)
    navigate({
      to: '/'
    })
  }

  const addPlayer = useCallback(async () => {
    const fn = (document.getElementById('firstname') as HTMLInputElement).value
    const ln = (document.getElementById('lastname') as HTMLInputElement).value
    const rt = +(document.getElementById('rating') as HTMLInputElement).value
    // only add if player doesn't exist for V1 - (change once playerID is implemented along with redesign of backend db tables)
    const playerExists = await window.api.checkIfPlayerExists(tourneyName, {
      firstName: fn,
      lastName: ln
    })

    if (playerExists) {
      toast({
        title: 'Invalid Input',
        description: `Player ${fn} ${ln} already exists...`
      })
    } else {
      const testName = { firstName: fn, lastName: ln, rating: rt }
      setRowData((prevData) => [testName, ...prevData])
      window.api.addPlayer(tourneyName, testName)
    }
  }, [rowData])

  const onRemoveSelected = useCallback(() => {
    const selectedData = gridRef.current!.api.getSelectedRows()
    if (selectedData.length == 1) {
      window.api.deletePlayer(tourneyName, selectedData)
      gridRef.current!.api.applyTransaction({
        remove: selectedData
      })!
      const removeName = `${selectedData[0].firstName} ${selectedData[0].lastName}`
      const data = rowData.filter((item) => {
        const playerName = `${item.firstName} ${item.lastName}`
        return playerName !== removeName
      })
      setRowData(data)
    }
  }, [rowData])

  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div className="flex flex-col gap-4 mx-auto w-[60%] max-w-5xl">
        <div className="flex items-center gap-2 justify-between">
          <Button
            variant="outline"
            className={`bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 ${rowData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={completeRegistration}
            disabled={rowData.length === 0}
          >
            Complete Registration
          </Button>

          <Button variant="destructive" onClick={handleDelete}>
            Delete Tournament
          </Button>
        </div>
        <div className="ag-theme-quartz w-full" style={{ height: 500 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={colDefs}
            rowSelection={'single'}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Add Player</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Player Details</DialogTitle>
                  <DialogDescription>
                    Enter new player information here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstname" className="text-right">
                      First Name
                    </Label>
                    <Input id="firstname" defaultValue="" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastname" className="text-right">
                      Last Name
                    </Label>
                    <Input id="lastname" defaultValue="" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rating" className="text-right">
                      Rating
                    </Label>
                    <Input
                      id="rating"
                      defaultValue="0"
                      type="number"
                      min="0"
                      max="5000"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit" onClick={addPlayer}>
                      Enter
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={onRemoveSelected}>
              Delete Selected
            </Button>
          </div>
          <div className="flex justify-end">
            <Link to="/">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
