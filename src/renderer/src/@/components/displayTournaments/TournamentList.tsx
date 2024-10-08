import { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'

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

import { ScrollArea } from '@renderer/@/components/ui/scroll-area'

export default function CardTournamentForm(): JSX.Element {
  const [tourneyList, setTourneyState] = useState(['default'])
  const [tourneyName, setTourneyName] = useState('None')
  const navigate = useNavigate()

  useEffect(() => {
    const f = async (): Promise<void> => {
      const names = await window.api.getList()
      setTourneyState(names)
    }
    f()
  }, [])

  const handleSelectTournament = async (): Promise<void> => {
    if (tourneyName !== 'None') {
      const standingsExist = await window.api.checkStandingsExist(tourneyName)

      if (standingsExist) {
        const isTourneyComplete = await window.api.checkTournamentComplete(tourneyName)
        if (isTourneyComplete) {
          navigate({
            to: '/tournamentCompleteView/$tourneyName',
            params: { tourneyName }
          })
        } else {
          navigate({
            to: '/roundGenView/$tourneyName',
            params: { tourneyName }
          })
        }
      } else {
        navigate({ to: '/editTournament', search: { tourneyName } })
      }
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Tournaments</CardTitle>
        <CardDescription>Select a tournament to view or edit.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tournament">Your tournaments</Label>
              <Select onValueChange={setTourneyName}>
                <SelectTrigger id="tournament">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5}>
                  <ScrollArea className="h-[200px]">
                    {tourneyList.map((option) => (
                      <SelectItem key={option.toLowerCase()} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to="/">
          <Button variant="outline">Back</Button>
        </Link>

        <Button onClick={handleSelectTournament}>Select</Button>
      </CardFooter>
    </Card>
  )
}
