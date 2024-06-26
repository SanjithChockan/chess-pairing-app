import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@renderer/@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@renderer/@/components/ui/card'
import { Input } from '@renderer/@/components/ui/input'
import { Label } from '@renderer/@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/@/components/ui/tabs'

export const Route = createFileRoute('/roundGenView/$tourneyName')({
  component: TournamentPanel
})

function TournamentPanel(): JSX.Element {
  const { tourneyName } = Route.useParams()

  return (
    <>
      <div>
        <h1>{tourneyName} Panel View </h1>
      </div>
      <Tabs defaultValue="standings" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="pairing">Pairing</TabsTrigger>
        </TabsList>
        <TabsContent value="standings"></TabsContent>
        <TabsContent value="pairing"></TabsContent>
      </Tabs>
    </>
  )
}
