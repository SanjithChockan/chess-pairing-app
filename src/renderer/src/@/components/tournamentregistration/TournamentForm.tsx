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

const formSchema = z.object({
  tournamentName: z.string().trim().min(1, {
    message: 'Enter tournament name'
  }),
  tournamenType: z.string().trim().min(1, { message: 'Tournament format is required' }),
  roundNum: z.coerce.number().gte(1, 'Number of rounds must be greater than 0')
})

export default function TournamentForm(): JSX.Element {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: '',
      tournamenType: '',
      roundNum: 1
    }
  })

  function onSubmit(values: z.infer<typeof formSchema>): void {
    // use ipc to send data to backend for processing
    window.api.tournamentForm(values)
    console.log(values)
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
                    <SelectItem value="Round-robin">Round-robin</SelectItem>
                    <SelectItem value="Elimination">Elimination</SelectItem>
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
          <Button type="submit">Create</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
