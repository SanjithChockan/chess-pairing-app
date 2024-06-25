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

export default function PlayerGrid({ tourneyName }): JSX.Element {
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
      console.log('retrieved player data')
      console.log(`player names: ${names}`)
    }
    f()
  }, [])

  const navigate = useNavigate()
  const completeRegistration = useCallback(async () => {
    await window.api.completeRegistration(tourneyName)
    navigate({ to: '/standings/$tourneyName', params: { tourneyName: tourneyName } })
  }, [tourneyName, navigate])

  const addPlayer = useCallback(() => {
    const fn = (document.getElementById('firstname') as HTMLInputElement).value
    const ln = (document.getElementById('lastname') as HTMLInputElement).value
    const rt = 0
    const testName = { firstName: fn, lastName: ln, rating: rt }
    const data = [testName, ...rowData]
    setRowData(data)
    window.api.addPlayer(tourneyName, testName)
  })

  const onRemoveSelected = useCallback(() => {
    const selectedData = gridRef.current!.api.getSelectedRows()
    window.api.deletePlayer(tourneyName, selectedData)
    const res = gridRef.current!.api.applyTransaction({
      remove: selectedData
    })!
  }, [])

  return (
    <div className="flex flex-col gap-4 mx-auto w-[60%] max-w-5xl">
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
                  <Input id="firstname" defaultValue="Pedro" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastname" className="text-right">
                    Last Name
                  </Label>
                  <Input id="lastname" defaultValue="Duarte" className="col-span-3" />
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
            onClick={completeRegistration}
          >
            Complete Registration
          </Button>
        </div>
      </div>

      <div className="ag-theme-quartz w-full" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection={'multiple'}
        />
      </div>
      <div className="flex justify-end">
        <Link to="/">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    </div>
  )
}
