const { app, BrowserWindow, screen } = require('electron')
const path = require('path')

const createWindow = () => {
    // DEV WINDOW PLACEMENT
    const windowWidth = 1280
    const windowHeight = 720
    const { x: xDefault, y: yDefault } = getScreensCenterOffsetPosition(1, windowWidth, windowHeight)

    const win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: xDefault,
        y: yDefault,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')

    //----- Add custom code here

}

const getScreensCenterOffsetPosition = (screenNum, chosenScreenWidth, chosenScreenHeight) => {
    const displays = screen.getAllDisplays()
    const mainScreen = displays.find(display => display.bounds.x === 0 && display.bounds.y === 0)
    const chosenScreen = screenNum < displays.length ? displays[screenNum] : undefined
    if (mainScreen !== undefined && chosenScreen !== undefined && mainScreen.id !== chosenScreen.id) {
        const x = chosenScreen.bounds.x - mainScreen.bounds.x + (chosenScreen.bounds.width / 2) - (chosenScreenWidth / 2)
        const y = chosenScreen.bounds.y - mainScreen.bounds.y + (chosenScreen.bounds.height / 2) - (chosenScreenHeight / 2)
        return { x, y }
    }

    return { 
        x: (mainScreen.bounds.width / 2) - (chosenScreenWidth / 2), 
        y: (mainScreen.bounds.height / 2) - (chosenScreenHeight / 2)
    }
}

app.whenReady().then(() => {
    createWindow()

    // MacOS
    app.on('activate', () => {
     if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
     }
    })
})

// Windows & Linux
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})


