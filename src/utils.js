const os = require('os')
const path = require('path')

function getDownloadObject (version) {
  const platform = os.platform()
  const filename = `foundry_${version}_${platform}_${os.arch()}`
  const extension = platform === 'win32' ? 'zip' : 'tar.gz'
  const binPath = platform === 'win32' ? 'bin' : path.join(filename, 'bin')
  const url = `https://github.com/gakonst/foundry/releases/download/${version}/${filename}.${extension}`

  return {
    url,
    binPath
  }
}

module.exports = {
  getDownloadObject
}
