// main.js
const axios = require('axios');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path')
const { geocodeCity, retrieveCityCounts, renderCityCircles, geocodeCities } = require('./utils');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    ipcMain.handle('geocode-cities', async (event, fileName) => {
        return geocodeCities(fileName);
    });
    ipcMain.handle('geocode-place', async (event, placeName) => {
        const result = geocodeCity(placeName);
        return result
    });
    ipcMain.handle('retrieve-city-counts', async (event, fileName) => {
        return retrieveCityCounts(fileName);
    });
   
    
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
