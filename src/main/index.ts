import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import getManagerObj from './backend/manager/index'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const managerObj = getManagerObj()
  // IPC Handlers
  ipcMain.on('tournamentForm', (_event, data) => {
    managerObj.createTournament(data.tournamentName, data.roundNum)
  })

  ipcMain.on('registerPlayer', (_event, data) => {
    managerObj.addPlayer(data.playerInfo, data.tournamentName)
  })

  ipcMain.on('removePlayer', (_event, data) => {
    managerObj.deletePlayer(data.playerInfo, data.tournamentName)
  })

  ipcMain.on('updateMatchResult', (_event, data) => {
    managerObj.updateResult(data.tournamentName, data.match_id, data.result)
  })

  ipcMain.handle('checkStandingsExist', async (_event, data) => {
    const doesExist = managerObj.checkStandings(data.tournamentName)
    return doesExist
  })

  ipcMain.handle('getRoundInProgress', async (_event, tournamentName) => {
    const inProgress = managerObj.checkRoundInProgress(tournamentName)
    return inProgress
  })

  ipcMain.handle('createStandings', async (_event, data) => {
    managerObj.createStandings(data.tournamentName)
  })

  ipcMain.on('sendTest', (_event, value) => {
    console.log('Printing from main process')
    console.log(value)
  })

  ipcMain.handle('getTourneyList', (_event, requestString) => {
    const names = managerObj.loadTournaments()
    const tourneyNames: string[] = []

    names.map((name: object) => {
      tourneyNames.push(name.name)
    })
    return tourneyNames
  })

  ipcMain.handle('completeRound', (_event, tournamentName) => {
    managerObj.completeRound(tournamentName)
    return
  })

  type playerObj = {
    firstname: string
    lastname: string
    rating: number
  }

  ipcMain.handle('getPlayers', (_event, tournamentName) => {
    const players = managerObj.getPlayers(tournamentName) as playerObj[]
    const playerNames: object[] = []

    players.map((player) => {
      playerNames.push({
        firstName: player.firstname,
        lastName: player.lastname,
        rating: player.rating
      })
    })
    return playerNames
  })

  ipcMain.handle('generatePairings', (_event, tournamentName) => {
    managerObj.generatePairings(tournamentName)
    return
  })

  ipcMain.handle('getPairings', (_event, tournamentName) => {
    const generatedMatches = managerObj.getPairings(tournamentName)
    return generatedMatches
  })

  type standingPlayer = {
    firstname: string
    lastname: string
    rating: number
    score: number
  }

  ipcMain.handle('getCurrentStandings', (_event, tournamentName) => {
    const playerStandings = managerObj.getCurrentStandings(tournamentName) as standingPlayer[]
    const playerNames: object[] = []

    playerStandings.map((player) => {
      playerNames.push({
        firstName: player.firstname,
        lastName: player.lastname,
        rating: player.rating,
        score: player.score
      })
    })
    return playerNames
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
