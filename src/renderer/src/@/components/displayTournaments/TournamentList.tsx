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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/@/components/ui/select'

export default function CardTournamentForm(): JSX.Element {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Tournaments</CardTitle>
        <CardDescription>Select tournament to edit.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tournament">Tournament</Label>
              <Select>
                <SelectTrigger id="tournament">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="sveltekit">SvelteKit</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="nuxt">Nuxt.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Select</Button>
      </CardFooter>
    </Card>
  )
}
