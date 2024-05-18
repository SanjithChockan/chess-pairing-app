import { useState, useEffect } from 'react'
import { Button } from '@renderer/@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@renderer/@/components/ui/card'
import { Label } from '@renderer/@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/@/components/ui/select'
import { get } from 'http'

export default function CardTournamentForm(): JSX.Element {
  const [tourneyList, setTourneyState] = useState(['default'])
  useEffect(() => {
    const f = async (): Promise<void> => {
      const names = await window.api.getList()
      setTourneyState(names)
      console.log('retrieved new data')
    }

    f()
  }, [])
  
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Tournaments</CardTitle>
        <CardDescription>Select tournament to edit.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tournament">Tournament</Label>
              <Select>
                <SelectTrigger id="tournament">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {tourneyList.map((option) => (
                    <SelectItem key={option.toLowerCase()} value={option.toLowerCase()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Select</Button>
      </CardFooter>
    </Card>
  )
}
