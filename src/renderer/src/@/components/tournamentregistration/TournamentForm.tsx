'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/@/components/ui/select'
import { Input } from '@renderer/@/components/ui/input'
import { Button } from '@renderer/@/components/ui/button'
import CardWrapper from './card-wrapper'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from '@tanstack/react-router'
import { useToast } from '@renderer/@/components/ui/use-toast'

const formSchema = z.object({
  tournamentName: z.string().trim().min(1, {
    message: 'Enter tournament name'
  }),
  tournamenType: z.string().trim().min(1, { message: 'Tournament format is required' }),
  roundNum: z.coerce.number().gte(1, 'Number of rounds must be greater than 0')
})

export default function TournamentForm(): JSX.Element {
  const { toast } = useToast()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: '',
      tournamenType: '',
      roundNum: 1
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    // no spaces allowed in tournament name
    if (/^\d|\s/.test(values.tournamentName)) {
      toast({
        title: 'Tournament Name Format',
        description: `Name should not start with a digit and should have no spaces`
      })
      return
    }
    const tourneyExists = await window.api.checkIfTournamentNameIsTaken(values.tournamentName)
    if (tourneyExists) {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Choose a different tournament name'
      })
    } else {
      // use ipc to send data to backend for processing
      window.api.tournamentForm(values)
      navigate({
        to: '/editTournament',
        search: { tourneyName: values.tournamentName }
      })
    }
  }

  return (
    <CardWrapper>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="tournamentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="US Open" {...field} />
                </FormControl>
                <FormDescription>Tournament public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tournamenType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tournament format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Swiss">Swiss</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select tournament format.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roundNum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rounds</FormLabel>
                <FormControl>
                  <Input placeholder="7" type="number" {...field} />
                </FormControl>
                <FormDescription>Number of rounds.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
