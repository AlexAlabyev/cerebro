import glob from 'glob';
import { memoize } from 'cerebro-tools'

const DIRECTORIES = [
  path.join('C:\Program Files (x86)'),
  path.join('C:\Program Files'),
]

const CACHE_TIME = 30 * 60 * 1000

const appsFinder = (onFileFound) => {
  DIRECTORIES.forEach(dir => {
    glob.readdirStream(`${dir}\**\*.exe`, {}).on('data', onFileFound)
  })
}

const getAppsList = memoize(getAppsFinder(DIRECTORIES))

export default (callback) => {
  const searchApps = () => getAppsList(file => {
    console.log(file)
  })

  // Force recache before expiration
  setInterval(searchApps, CACHE_TIME)
  searchApps()

  // recache apps when apps directories changed
  DIRECTORIES.forEach(dir => {
    fs.watch(dir, WATCH_OPTIONS, recache)
  })
}
