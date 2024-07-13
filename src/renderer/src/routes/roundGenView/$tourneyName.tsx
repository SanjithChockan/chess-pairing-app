import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/@/components/ui/tabs'
import { useState } from 'react'
import CurrentStandings from '@renderer/@/components/standings/CurrentStandings'

export const Route = createFileRoute('/roundGenView/$tourneyName')({
  component: TournamentPanel
})

function TournamentPanel(): JSX.Element {
  const { tourneyName } = Route.useParams()
  const [activeTab, setActiveTab] = useState<string>('standings')

  const handleTabChange = (value: string): void => {
    setActiveTab(value)
  }

  return (
    <>
      <div>
        <h1>{tourneyName} Panel View </h1>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="pairing">Pairing</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="standings">
          <CurrentStandings
            tourneyName={tourneyName}
            onGeneratePairings={() => handleTabChange('pairing')}
          ></CurrentStandings>
        </TabsContent>
        <TabsContent value="pairing">
          <h1>Current Pairing</h1>
        </TabsContent>
      </Tabs>
    </>
  )
}
