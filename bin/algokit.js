#!/usr/bin/env node

const VERSION = 'v1.5.0-beta.2'
const PYTHON = '3.12'
const REPO = 'https://github.com/PhearZero/algokit-cli'

import os from 'node:os';
import {resolve, dirname} from 'node:path'
import {spawn} from "node:child_process";
import {Readable} from 'node:stream';
import {finished} from 'node:stream/promises';
import {existsSync, createWriteStream, unlinkSync} from "node:fs";
import { fileURLToPath } from 'node:url'
import tar from "tar";


const __dirname = dirname(fileURLToPath(import.meta.url))

const SYSTEMS = {
    'Darwin': 'macOS',
    'Windows_NT': 'Windows',
    'Linux': 'Linux'
}

const ARCHS = {
    x32: 'X32',
    x64: 'X64',
    arm: 'ARM',
    arm64: 'ARM64',
    s390: 'S390',
    s390x: 'S390X',
    mipsel: 'MIPSEL',
    ia32: 'IA32',
    mips: 'MIPS',
    ppc: 'PPC',
    ppc64: 'PPC64'
}

let localCmd = resolve(__dirname, `algokit${os.type() === 'Windows_NT' ? '.exe' : ''}`)
let cmdPath = existsSync(localCmd) ? localCmd : 'algokit'

// Run Install
if(!existsSync(localCmd)) {
    console.log('Installing algokit...')
    // Download
    const release = `${REPO}/releases/download/${VERSION}`
    const tarName = `algokit-${VERSION}-${SYSTEMS[os.type()]}-${ARCHS[os.arch()]}-py${PYTHON}.tar.gz`
    const {body} = await fetch(`${release}/${tarName}`)
    const fileStream = createWriteStream(resolve(__dirname, 'algokit.tar.gz'))
    await finished(Readable.from(body).pipe(fileStream))

    // Unpack
    const tarPath = resolve(__dirname, 'algokit.tar.gz')
    await tar.x({
        file: tarPath,
        cwd: __dirname
    })
    unlinkSync(tarPath)
    cmdPath = localCmd
}

spawn(cmdPath, process.argv.slice(2), { stdio: 'inherit' })
