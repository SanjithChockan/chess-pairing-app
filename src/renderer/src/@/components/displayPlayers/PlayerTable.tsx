import { AgGridReact } from 'ag-grid-react'
import { useCallback, useState } from 'react'
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

let data: object[] = [
  {
    firstName: 'testfn1',
    lastName: 'testln1'
  },
  {
    firstName: 'sanjith',
    lastName: 'chockan'
  }
]
export default function PlayerGrid(): JSX.Element {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState(data)

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([{ field: 'firstName' }, { field: 'lastName' }])

  const addPlayer = useCallback(() => {
    console.log('Adding new Player')
    const fn = (document.getElementById('firstname') as HTMLInputElement).value
    const ln = (document.getElementById('lastname') as HTMLInputElement).value
    const testName = { firstName: fn, lastName: ln }
    data = [testName, ...data]
    setRowData(data)
  })

  return (
    // wrapping container with theme & size
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: 500 }} // the grid will fill the size of the parent container
    >
      <div>
        <Button variant="outline" size="lg" onClick={addPlayer}>
          Add Player
        </Button>
      </div>

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
    </div>
  )
}
