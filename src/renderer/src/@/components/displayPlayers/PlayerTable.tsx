import { AgGridReact } from 'ag-grid-react'
import { useCallback, useEffect, useState } from 'react'
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
import { Link } from '@tanstack/react-router'

export default function PlayerGrid({ tourneyName }): JSX.Element {
  const [playersList, setPlayersState] = useState([{ firstName: '', lastName: '' }])
  const [rowData, setRowData] = useState(playersList)
  const [colDefs, setColDefs] = useState([{ field: 'firstName' }, { field: 'lastName' }])

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

  const addPlayer = useCallback(() => {
    console.log('Adding new Player')
    const fn = (document.getElementById('firstname') as HTMLInputElement).value
    const ln = (document.getElementById('lastname') as HTMLInputElement).value
    const testName = { firstName: fn, lastName: ln }
    data = [testName, ...data]
    setRowData(data)
    window.api.addPlayer(tourneyName, testName)
  })

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
      <div>
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
      </div>
      <Link to="/">
          <Button variant="outline">Back</Button>
        </Link>
    </div>
  )
}
