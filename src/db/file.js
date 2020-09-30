import {
  Dir,
  readTextFile,
  writeFile,
} from 'tauri/api/fs'

class File {
  constructor (filename = 'runcloudapp.conf') {
    this.filename = filename
    this.options = {
      dir: Dir.LocalData
    }
  }

  async read () {
    try {
      const json = await readTextFile(this.filename, this.options)
      return json ? JSON.parse(json) : {}
    } catch (err) {
      console.warn('No config file yet.')
    }

    return {}
  }

  async write (data) {
    const file = {
      path: this.filename,
      contents: JSON.stringify(data)
    }
    await writeFile(file, this.options)
  }
}

export default File