import glob from 'glob';
import path from 'path'
import fs from 'fs'

const DIRECTORIES = [
  'C:\\Program Files (x86)',
  'C:\\Program Files',
]

const CACHE_TIME = 30 * 60 * 1000

const getAppsList = (onFound) => {
  DIRECTORIES.forEach(dir => {
    glob(`${dir}\\**\\*.exe`, {}, onFound)
  })
}

const formatPath = (filePath) => ({
  path: filePath,
  filename: path.basename(filePath),
  name: path.basename(filePath).replace(/\.exe/, ''),
})

export default (callback) => {
  const searchApps = () => getAppsList((err, files) => {
    const apps = files.map(formatPath)
    callback(apps)
  })

  // Force recache before expiration
  setInterval(searchApps, CACHE_TIME)
  searchApps()

  // recache apps when apps directories changed
  DIRECTORIES.forEach(dir => {
    fs.watch(dir, {}, searchApps)
  })
}
