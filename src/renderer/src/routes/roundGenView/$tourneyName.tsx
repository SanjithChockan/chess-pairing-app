import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/@/components/ui/tabs'
import CurrentStandings from '@renderer/@/components/standings/CurrentStandings'
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
      <Tabs defaultValue="standings">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="pairing">Pairing</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="standings">
          <CurrentStandings tourneyName={tourneyName}></CurrentStandings>
        </TabsContent>
        <TabsContent value="pairing"></TabsContent>
      </Tabs>
    </>
  )
}
