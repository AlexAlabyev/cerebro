import { memoize, search } from 'cerebro-tools'
import uniq from 'lodash/uniq'
import initializeAsync from './initializeAsync'
import { shell } from 'electron'

const appsList = []

const toString = (app) => `${app.name} ${app.filename}`

const appsPlugin = ({ term, actions, display }) => {
  const result = search(appsList, term, toString).map(file => {
    const { path, name } = file
    return {
      title: name,
      term: name,
      subtitle: path,
      onKeyDown: (event) => {
        if (event.ctrlKey && event.keyCode === 82) {
          // Show application by ctrl+R shortcut
          actions.reveal(path)
          event.preventDefault()
        }
      },
      onSelect: () => shell.openItem(path),
    }
  })
  display(result)
}

export default {
  fn: appsPlugin,
  initializeAsync,
  onMessage: (apps) => {
    appsList = uniq([...appsList, ...apps])
  }
}
