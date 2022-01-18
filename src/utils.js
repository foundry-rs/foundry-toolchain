const core = require('@actions/core')
const github = require('@actions/github')
const os = require('os')
const path = require('path')

async function getLatestForReleaseChannel (channel) {
  const octokit = github.getOctoKit(
    core.getInput('token')
  )

  const { data: ref } = await octokit.rest.git.getRef({
    owner: 'gakonst',
    repo: 'foundry',
    ref: `tags/${channel}`
  })

  return ref.object.sha
}

async function getVersion (version) {
  if (version === 'nightly' || version === 'stable') {
    const sha = await getLatestForReleaseChannel(version)
    return {
      tag: `${version}-${sha}`,
      version
    }
  } else if (!version.startsWith('v')) {
    return {
      tag: `v${version}`,
      version: `v${version}`
    }
  }

  return {
    tag: version,
    version
  }
}

function mapArch (arch) {
  const mappings = {
    x32: '386',
    x64: 'amd64'
  }

  return mappings[arch] || arch
}

function getDownloadObject (tag, version) {
  const platform = os.platform()
  const filename = `foundry_${version}_${platform}_${mapArch(os.arch())}`
  const extension = platform === 'win32' ? 'zip' : 'tar.gz'
  const url = `https://github.com/gakonst/foundry/releases/download/${tag}/${filename}.${extension}`

  return {
    url,
    binPath: '.'
  }
}

module.exports = {
  getVersion,
  getDownloadObject
}
