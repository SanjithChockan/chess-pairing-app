/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoadTournamentImport } from './routes/loadTournament'
import { Route as GenerateRoundsImport } from './routes/generateRounds'
import { Route as EditTournamentImport } from './routes/editTournament'
import { Route as CreateTournamentImport } from './routes/createTournament'
import { Route as IndexImport } from './routes/index'
import { Route as TournamentCompleteViewTourneyNameImport } from './routes/tournamentCompleteView/$tourneyName'
import { Route as StandingsTourneyNameImport } from './routes/standings/$tourneyName'
import { Route as RoundGenViewTourneyNameImport } from './routes/roundGenView/$tourneyName'

// Create/Update Routes

const LoadTournamentRoute = LoadTournamentImport.update({
  path: '/loadTournament',
  getParentRoute: () => rootRoute,
} as any)

const GenerateRoundsRoute = GenerateRoundsImport.update({
  path: '/generateRounds',
  getParentRoute: () => rootRoute,
} as any)

const EditTournamentRoute = EditTournamentImport.update({
  path: '/editTournament',
  getParentRoute: () => rootRoute,
} as any)

const CreateTournamentRoute = CreateTournamentImport.update({
  path: '/createTournament',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TournamentCompleteViewTourneyNameRoute =
  TournamentCompleteViewTourneyNameImport.update({
    path: '/tournamentCompleteView/$tourneyName',
    getParentRoute: () => rootRoute,
  } as any)

const StandingsTourneyNameRoute = StandingsTourneyNameImport.update({
  path: '/standings/$tourneyName',
  getParentRoute: () => rootRoute,
} as any)

const RoundGenViewTourneyNameRoute = RoundGenViewTourneyNameImport.update({
  path: '/roundGenView/$tourneyName',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/createTournament': {
      id: '/createTournament'
      path: '/createTournament'
      fullPath: '/createTournament'
      preLoaderRoute: typeof CreateTournamentImport
      parentRoute: typeof rootRoute
    }
    '/editTournament': {
      id: '/editTournament'
      path: '/editTournament'
      fullPath: '/editTournament'
      preLoaderRoute: typeof EditTournamentImport
      parentRoute: typeof rootRoute
    }
    '/generateRounds': {
      id: '/generateRounds'
      path: '/generateRounds'
      fullPath: '/generateRounds'
      preLoaderRoute: typeof GenerateRoundsImport
      parentRoute: typeof rootRoute
    }
    '/loadTournament': {
      id: '/loadTournament'
      path: '/loadTournament'
      fullPath: '/loadTournament'
      preLoaderRoute: typeof LoadTournamentImport
      parentRoute: typeof rootRoute
    }
    '/roundGenView/$tourneyName': {
      id: '/roundGenView/$tourneyName'
      path: '/roundGenView/$tourneyName'
      fullPath: '/roundGenView/$tourneyName'
      preLoaderRoute: typeof RoundGenViewTourneyNameImport
      parentRoute: typeof rootRoute
    }
    '/standings/$tourneyName': {
      id: '/standings/$tourneyName'
      path: '/standings/$tourneyName'
      fullPath: '/standings/$tourneyName'
      preLoaderRoute: typeof StandingsTourneyNameImport
      parentRoute: typeof rootRoute
    }
    '/tournamentCompleteView/$tourneyName': {
      id: '/tournamentCompleteView/$tourneyName'
      path: '/tournamentCompleteView/$tourneyName'
      fullPath: '/tournamentCompleteView/$tourneyName'
      preLoaderRoute: typeof TournamentCompleteViewTourneyNameImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  CreateTournamentRoute,
  EditTournamentRoute,
  GenerateRoundsRoute,
  LoadTournamentRoute,
  RoundGenViewTourneyNameRoute,
  StandingsTourneyNameRoute,
  TournamentCompleteViewTourneyNameRoute,
})

/* prettier-ignore-end */
