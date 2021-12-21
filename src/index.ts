import fs = require('fs')
import p = require('path')
import config = require('./config')
import utils = require('./utils')

const { HUSKY_DIR } = config
const { l, hg, setHooks, clearHooks, getHuskyPath } = utils

export function install(): void {
  // Ensure that we're inside a hg repository
  // If hg command is not found, status is null and we should return.
  // That's why status value needs to be checked explicitly.
  if (hg(['root']).status !== 0) {
    return
  }

  // Custom dir help
  const url = 'https://git.io/Jc3F9'

  // Ensure that we're not trying to install outside of cwd
  if (!p.resolve(process.cwd(), HUSKY_DIR).startsWith(process.cwd())) {
    throw new Error(`.. not allowed (see ${url})`)
  }

  // Ensure that cwd is hg top level
  if (!fs.existsSync('.hg')) {
    throw new Error(`.hg can't be found (see ${url})`)
  }

  try {
    // Create .husky/_
    fs.mkdirSync(p.join(HUSKY_DIR, '_'), { recursive: true })

    // Hg not support sub directory .hgignore
    // Create .hgignore
    let ignoreRules = ''
    try {
      ignoreRules = fs.readFileSync('.hgignore', 'utf8')
    } catch (err) {
      console.log('Creating .hgignore')
    }

    const appendIgnoreRules = '\n' + p.join(HUSKY_DIR, '_') + '\n'

    if (!ignoreRules.includes(appendIgnoreRules)) {
      ignoreRules += appendIgnoreRules

      fs.writeFileSync('.hgignore', ignoreRules)
    }

    // Copy husky.sh to .husky/_/husky.sh
    fs.copyFileSync(
      p.join(__dirname, '../husky.sh'),
      p.join(HUSKY_DIR, '_/husky.sh')
    )

    // Add already exists hooks to .hg/hgrc
    const scripts = utils.getHookScripts()

    setHooks(
      scripts.map((name) => ({
        name
      })),
      true
    )
  } catch (e) {
    l('Hg hooks failed to install')
    throw e
  }

  l('Hg hooks installed')
}

export function set(hook: string, cmd: string): void {
  const dir = getHuskyPath()

  if (!fs.existsSync(dir)) {
    throw new Error(
      `can't create hook, ${dir} directory doesn't exist (try running husky install)`
    )
  }

  setHooks([{ name: hook, cmd }])

  l(`created ${hook}`)
}

export function add(hook: string, cmd: string): void {
  const file = p.join(getHuskyPath(), hook)

  if (fs.existsSync(file)) {
    fs.appendFileSync(file, `${cmd}\n`)
    l(`updated ${hook}`)
  } else {
    set(hook, cmd)
  }
}

export function uninstall(): void {
  clearHooks()

  l(`Hg hooks uninstalled`)
}
