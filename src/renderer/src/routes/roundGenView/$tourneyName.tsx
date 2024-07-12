import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/@/components/ui/tabs'
import CurrentStandings from '@renderer/@/components/standings/CurrentStandings'

export const Route = createFileRoute('/roundGenView/$tourneyName')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: search.tab as string
    }
  },
  component: TournamentPanel
})

function TournamentPanel(): JSX.Element {
  const { tourneyName } = Route.useParams()
  const { tab } = Route.useSearch()
  const defaultValue = tab === 'pairing' ? 'pairing' : 'standings'
  console.log(`rerouted with default value ${defaultValue}`)
  return (
    <>
      <div>
        <h1>{tourneyName} Panel View </h1>
      </div>
      <Tabs defaultValue={defaultValue}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="pairing">Pairing</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="standings">
          <CurrentStandings tourneyName={tourneyName}></CurrentStandings>
        </TabsContent>
        <TabsContent value="pairing">
          <h1>Current Pairing</h1>
        </TabsContent>
      </Tabs>
    </>
  )
}
