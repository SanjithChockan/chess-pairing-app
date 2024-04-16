import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle
} from '@renderer/@/components/ui/card'

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
        Card Footer
        {/* Create submit and back button here */}
      </CardFooter>
    </Card>
  )
}

export default CardWrapper
