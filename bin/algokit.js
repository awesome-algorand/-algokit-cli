#!/usr/bin/env node

const VERSION = 'v1.11.3'
const PYTHON = '3.12'
const REPO = 'https://github.com/algorandfoundation/algokit-cli'

import os from 'node:os';
import {resolve, dirname} from 'node:path'
import commandExists from 'command-exists';
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

await commandExists('algokit', async (err, foundCommand)=>{

    if(err) throw err;

    let localCmd = resolve(__dirname, `algokit${os.type() === 'Windows_NT' ? '.exe' : ''}`)
    let cmdPath = existsSync(localCmd) ? localCmd : 'algokit'

    // Run Install
    if(!foundCommand && !existsSync(localCmd)) {
        // Download
        const {body} = await fetch(`${REPO}/releases/download/${VERSION}/algokit-${VERSION}-${SYSTEMS[os.type()]}-py${PYTHON}.tar.gz`)
        const fileStream = createWriteStream(resolve(__dirname, 'algokit.tar.gz'))
        await finished(Readable.from(body).pipe(fileStream))

        // Unpack
        const tarPath = resolve(__dirname, 'algokit.tar.gz')
        await tar.x({
          file: tarPath,
          cwd: __dirname
        })
        unlinkSync(tarPath)
    }

    spawn(cmdPath, process.argv.slice(2), { stdio: 'inherit' })
})
