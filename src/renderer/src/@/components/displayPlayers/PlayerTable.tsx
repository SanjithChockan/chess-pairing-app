import { AgGridReact } from 'ag-grid-react'
import { useState } from 'react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { data } from './mockData'

export default function PlayerGrid(): JSX.Element {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState(data)

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([{ field: 'firstName' }, { field: 'lastName' }])

  return (
    // wrapping container with theme & size
    <div
      className="ag-theme-quartz" // applying the grid theme
      style={{ height: 500 }} // the grid will fill the size of the parent container
    >
      <AgGridReact rowData={rowData} columnDefs={colDefs} />
    </div>
  )
}
