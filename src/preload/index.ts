import { ipcRenderer, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export type ContextBridgeApi = {
  simpleString: (testString: string) => void
  tournamentForm: (data) => void
  getList: () => Promise<string[]>
  getPlayers: (tournamentName: string) => Promise<object[]>
  addPlayer: (tournamentName: string, playerInfo) => void
  deletePlayer: (tournamentName, playerInfo) => void
  completeRegistration: (tournamentName) => Promise<void>
  checkStandingsExist: (tournamentName) => Promise<boolean>
  getCurrentStandings: (tournamentName) => Promise<object[]>
  generatePairings: (tournamentName) => void
  updateMatchResult: (tournamentName, match_id, result) => Promise<void>
  getPairings: (tournamentName) => Promise<object[]>
  getRoundInProgress: (tournamentName) => Promise<boolean>
  completeRound: (tournamentName) => Promise<void>
  checkTournamentComplete: (tournamentName) => Promise<boolean>
}

// Custom APIs for renderer
const api: ContextBridgeApi = {
  simpleString: (value) => ipcRenderer.send('sendTest', value),
  tournamentForm: (tournamentInfo) => ipcRenderer.send('tournamentForm', tournamentInfo),
  getList: async (): Promise<string[]> => {
    const result = await ipcRenderer.invoke('getTourneyList', 'REQUESTING LIST')
    return result
  },
  getPlayers: async (tournamentName: string): Promise<object[]> => {
    const result: object[] = await ipcRenderer.invoke('getPlayers', tournamentName)
    return result
  },
  addPlayer: (tournamentName, playerInfo) =>
    ipcRenderer.send('registerPlayer', { tournamentName, playerInfo }),
  deletePlayer: (tournamentName, playerInfo) =>
    ipcRenderer.send('removePlayer', { tournamentName, playerInfo }),
  completeRegistration: (tournamentName) =>
    ipcRenderer.invoke('createStandings', { tournamentName }),
  checkStandingsExist: (tournamentName) =>
    ipcRenderer.invoke('checkStandingsExist', { tournamentName }),
  getCurrentStandings: async (tournamentName: string): Promise<object[]> => {
    const result: object[] = await ipcRenderer.invoke('getCurrentStandings', tournamentName)
    return result
  },
  generatePairings: async (tournamentName: string) => {
    const result = await ipcRenderer.invoke('generatePairings', tournamentName)
    return result
  },
  updateMatchResult: async (tournamentName, match_id, result) => {
    await ipcRenderer.invoke('updateMatchResult', { tournamentName, match_id, result })
    return
  },

  getPairings: async (tournamentName) => {
    const result = await ipcRenderer.invoke('getPairings', tournamentName)
    return result
  },
  getRoundInProgress: async (tournamentName) => {
    const result = await ipcRenderer.invoke('getRoundInProgress', tournamentName)
    return result
  },
  completeRound: async (tournamentName) => {
    await ipcRenderer.invoke('completeRound', tournamentName)
    return
  },
  checkTournamentComplete: async (tournamentName) => {
    const result = await ipcRenderer.invoke('isTournamentComplete', tournamentName)
    return result
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
