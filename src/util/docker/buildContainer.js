import path from 'path'
import fs from 'fs'
import BbPromise from 'bluebird'
import execa from 'execa'

const fsp = BbPromise.promisifyAll(fs)

async function buildContainer(projectDirPath, dockerfilePath) {
  const projectName = projectDirPath
    .split(path.sep)
    .slice(-1)
    .pop()
  const dockerfileContent = await fsp.readFileAsync(dockerfilePath, 'utf8')

  // this splits the Dockerfile at its newlines and uses the first entry
  // to extract the iamge name
  const image = dockerfileContent.split('\n')[0].replace('FROM ', '')
  const tag = `pipeline/${projectName}/${image}`

  await execa('docker', [ 'build', '--tag', tag, '--file', dockerfilePath, projectDirPath ])
  return tag
}

export default buildContainer
