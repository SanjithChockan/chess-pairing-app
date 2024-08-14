import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/@/components/ui/tabs'
import { useState } from 'react'
import CurrentStandings from '@renderer/@/components/standings/CurrentStandings'
import PairingView from '@renderer/@/components/pairing/PairingView'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@renderer/@/components/ui/button'

export const Route = createFileRoute('/roundGenView/$tourneyName')({
  component: TournamentPanel
})

function TournamentPanel(): JSX.Element {
  const { tourneyName } = Route.useParams()
  const [activeTab, setActiveTab] = useState<string>('standings')
  const [currentPairings, setCurrentPairings] = useState<object[]>([])
  const navigate = useNavigate()

  const handleTabChange = (value: string): void => {
    setActiveTab(value)
  }

  const handlePairing = (value: string, matches): void => {
    setCurrentPairings(matches)
    setActiveTab(value)
  }

  const handleCompleteRound = (): void => {
    setActiveTab('standings')
  }

  const handleDelete = async (): Promise<void> => {
    // call delete function from api
    await window.api.deleteTournament(tourneyName)
    navigate({
      to: '/'
    })
  }

  return (
    <div className="flex w-full h-screen justify-center items-center ">
      <div className="flex flex-col space-y-4 w-3/5">
        <div>
          <p className="text-2xl">{tourneyName}</p>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="standings">Standings</TabsTrigger>
              <TabsTrigger value="pairing">Pairing</TabsTrigger>
            </TabsList>

            <Button variant="destructive" onClick={handleDelete}>
              Delete Tournament
            </Button>
          </div>
          <TabsContent value="standings">
            <CurrentStandings
              tourneyName={tourneyName}
              onGeneratePairings={(matches) => handlePairing('pairing', matches)}
            ></CurrentStandings>
          </TabsContent>
          <TabsContent value="pairing">
            <PairingView
              tourneyName={tourneyName}
              pairings={currentPairings}
              onCompleteRound={() => handleCompleteRound()}
            ></PairingView>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
