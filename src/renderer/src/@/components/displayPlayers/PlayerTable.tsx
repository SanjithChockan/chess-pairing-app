import { AgGridReact } from 'ag-grid-react'
import { useCallback, useState } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { Button } from '@renderer/@/components/ui/button'
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
    const testName = { firstName: 'S', lastName: 'B' }
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
    </div>
  )
}
