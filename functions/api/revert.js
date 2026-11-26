import { github, CONTENT_PATH } from '../../server/github.js'
import { fail, json } from '../../server/http.js'
import { validate } from '../../shared/schema.js'

const SHA = /^[0-9a-f]{40}$/

// POST /api/revert { commit }  -> publishes the content as it was after `commit`
export async function onRequestPost({ request, env, data }) {
  const body = await request.json().catch(() => null)
  if (!body || !SHA.test(body.commit ?? '')) return fail(400, 'Invalid version.')

  const gh = github(env)
  const old = await gh.readFile(CONTENT_PATH, body.commit)
  const content = JSON.parse(old.text)
  if (validate(content).length) return fail(422, 'That old version cannot be restored automatically.')

  const head = await gh.head()
  const current = await gh.readFile(CONTENT_PATH, head)
  if (current.sha === old.sha) return json({ sha: current.sha, commit: head, unchanged: true })

  const result = await gh.commit({
    parent: head,
    message: `Content: restore version ${body.commit.slice(0, 7)} (by ${data.admin.name})`,
    files: [{ path: CONTENT_PATH, text: old.text }],
  })
  return json({ sha: result.blobFor(CONTENT_PATH), commit: result.commit })
}
