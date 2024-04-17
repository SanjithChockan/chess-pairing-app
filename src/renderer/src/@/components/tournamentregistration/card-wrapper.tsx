import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle
} from '@renderer/@/components/ui/card'
import { Button } from '@renderer/@/components/ui/button'
import { Link } from '@tanstack/react-router'

interface CardWrapperProps {
  children: React.ReactNode
}

const CardWrapper = ({ children }: CardWrapperProps): JSX.Element => {
  return (
    <Card className="xl:w-1/4 md:w-1/2 shadow-md">
      <CardHeader>
        <CardTitle>Create Tournament</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Button variant="link" className="font-normal w-full" size="sm" asChild>
          <Link to="/">Return to homepage</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CardWrapper
