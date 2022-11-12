function CheckCookieAge(date) {
    const today = Date.now()
    const elapsedTime = today - date
    const daysDiff = elapsedTime / (1000*3600*24)
    if(daysDiff >= 1){
        localStorage.clear()
        localStorage.setItem('spotifyStorageDate', Date.now())
    }
}