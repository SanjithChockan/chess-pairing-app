import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@renderer/@/components/ui/card'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@renderer/@/components/ui/form";

export default function TournamentForm(): JSX.Element {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Create Tournament</CardTitle>
          <CardDescription>Enter tournament info</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>

        <Form>
        
        </Form>
      </Card>
    </>
  )
}
