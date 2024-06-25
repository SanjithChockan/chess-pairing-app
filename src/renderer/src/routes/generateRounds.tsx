import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/generateRounds')({
  component: generateRounds
})

function generateRounds(): JSX.Element {
  const { tourneyName } = Route.useParams()

  return (
    <>
      <div>
        <h1>Generate Rounds for Tournament: {tourneyName}</h1>
      </div>
    </>
  )
}
