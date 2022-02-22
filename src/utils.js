const os = require('os')

function mapArch (arch) {
  const mappings = {
    x32: '386',
    x64: 'amd64'
  }

  return mappings[arch] || arch
}

function getDownloadObject (version) {
  const version_name = version.replace(/^nightly-[0-9a-f]{40}$/, "nightly");
  const platform = os.platform()
  const filename = `foundry_${version_name}_${platform}_${mapArch(os.arch())}`
  const extension = platform === 'win32' ? 'zip' : 'tar.gz'
  const url = `https://github.com/gakonst/foundry/releases/download/${version}/${filename}.${extension}`

  return {
    url,
    binPath: '.'
  }
}

module.exports = {
  getDownloadObject
}
