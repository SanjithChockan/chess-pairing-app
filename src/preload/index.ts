import { ipcRenderer, contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export type ContextBridgeApi = {
  simpleString: (testString: string) => void
  tournamentForm: (data) => void
  getList: () => Promise<string[]>
  getPlayers: (tournamentName: string) => Promise<object[]>
  addPlayer: (tournamentName: string, playerInfo) => void
}

type playerObject = {
  fn: string
  ln: string
}
// Custom APIs for renderer
const api: ContextBridgeApi = {
  simpleString: (value) => ipcRenderer.send('sendTest', value),
  tournamentForm: (tournamentInfo) => ipcRenderer.send('tournamentForm', tournamentInfo),
  getList: async (): Promise<string[]> => {
    const result = await ipcRenderer.invoke('getTourneyList', 'REQUESTING LIST')
    return result
  },
  getPlayers: async (tournamentName: string): Promise<playerObject[]> => {
    const result: playerObject[] = await ipcRenderer.invoke('getPlayers', tournamentName)
    return result
  },
  addPlayer: (tournamentName, playerInfo) =>
    ipcRenderer.send('registerPlayer', { tournamentName, playerInfo })
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
