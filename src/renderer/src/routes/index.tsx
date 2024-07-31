import { Button } from '@renderer/@/components/ui/button'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Separator } from '@renderer/@/components/ui/separator'

export const Route = createFileRoute('/')({
  component: Index
})

function Index(): JSX.Element {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col space-y-4 w-64">
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">Chess Verse</h4>
            <p className="text-sm text-muted-foreground">Offline Chess Swiss Pairing Software</p>
          </div>
          <Separator className="my-4" />
          <Link to="/createTournament" className="w-full">
            <Button variant="outline" size="lg" className="w-full">
              Create Tournament
            </Button>
          </Link>

          <Link to="/loadTournament" className="w-full">
            <Button variant="outline" size="lg" className="w-full">
              Load Tournament
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
