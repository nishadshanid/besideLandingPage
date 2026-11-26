import { github, CONTENT_PATH } from '../../server/github.js'
import { json } from '../../server/http.js'

export async function onRequestGet({ env }) {
  return json({ commits: await github(env).history(CONTENT_PATH, 25) })
}
