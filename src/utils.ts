// const spawn = require('-spawn')
import cp = require('child_process')
import fs = require('fs')
import p = require('path')
import ini = require('ini')
import config = require('./config')

const { HUSKY_DIR } = config

type Config = ReturnType<typeof getConfig>

interface Hook {
  name: string
  cmd: string
}

// Logger
export const l = (msg: string): void => console.log(`husky - ${msg}`)

// hg command
export const hg = (args: string[]): cp.SpawnSyncReturns<string> =>
  cp.spawnSync('hg', args, { stdio: 'pipe', encoding: 'utf-8' })

export const getHgRoot = (): string => {
  return hg(['root']).stdout.trim()
}

export const getConfigPath = () => p.join(getHgRoot(), '.hg/hgrc')

export const getHuskyPath = () => p.join(getHgRoot(), HUSKY_DIR)

export function getConfig(): ReturnType<typeof ini.parse> {
  return ini.parse(fs.readFileSync(getConfigPath(), 'utf8'))
}

export function setConfig(config: Config): void {
  fs.writeFileSync(getConfigPath(), ini.stringify(config))
}

export function writeHookScript(hook: Hook): void {
  const huskyDir = getHuskyPath()

  fs.writeFileSync(
    p.join(huskyDir, hook.name),
    `#!/bin/bash
    . "$(dirname "$0")/_/husky.sh"
    
    ${hook.cmd}
    `,
    { mode: 0o0755 }
  )
}

export function getHookScripts(): string[] {
  const huskyDir = getHuskyPath()

  return fs.readdirSync(huskyDir).filter((file) => file !== '_')
}

export function setHooks(hooks: Array<Pick<Hook, 'name'>>, existed: true): void
export function setHooks(hooks: Array<Hook>): void
export function setHooks(
  hooks: Array<Hook> | Array<Pick<Hook, 'name'>>,
  existed = false
): void {
  const config = getConfig()

  config.hooks = config.hooks || {}

  hooks.forEach((hook) => {
    if (!existed) {
      writeHookScript(hook as Hook)
    }

    config.hooks[hook.name] = `./${HUSKY_DIR}/${hook.name}`
  })

  setConfig(config)
}

export function clearHooks(): void {
  const config = getConfig()

  delete config.hooks

  setConfig(config)
}
