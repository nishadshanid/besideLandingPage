// Minimal GitHub REST client for the admin API. The token lives only in the
// Cloudflare environment (GITHUB_TOKEN) and never reaches the browser.

export const CONTENT_PATH = 'content/site.json'

export class GitHubError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function github(env) {
  const api = env.GITHUB_API_URL || 'https://api.github.com'
  const repo = env.GITHUB_REPO
  const branch = env.GITHUB_BRANCH || 'main'

  async function call(method, path, body) {
    const res = await fetch(`${api}/repos/${repo}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'beside-admin',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      // a prebuilt JSON string is passed through untouched (used for big uploads)
      body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new GitHubError(res.status, `GitHub ${method} ${path} -> ${res.status} ${detail.slice(0, 300)}`)
    }
    return res.status === 204 ? null : res.json()
  }

  const decodeUtf8 = (b64) =>
    new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), (c) => c.charCodeAt(0)))

  return {
    branch,

    async head() {
      const ref = await call('GET', `/git/ref/heads/${encodeURIComponent(branch)}`)
      return ref.object.sha
    },

    // { text, sha } of a file at a ref (commit sha or branch)
    async readFile(path, ref = branch) {
      const f = await call('GET', `/contents/${path}?ref=${encodeURIComponent(ref)}`)
      return { text: decodeUtf8(f.content), sha: f.sha }
    },

    async listPaths(ref) {
      const t = await call('GET', `/git/trees/${ref}?recursive=1`)
      return new Set(t.tree.filter((e) => e.type === 'blob').map((e) => e.path))
    },

    // base64Body is the raw base64 text from the browser; it is spliced into
    // the request as-is so the Worker never decodes the image.
    async createBlobFromBase64(base64Body) {
      const blob = await call('POST', '/git/blobs', `{"encoding":"base64","content":"${base64Body}"}`)
      return blob.sha
    },

    // Writes several files in ONE commit on top of `parent`. Fails with 409 if
    // the branch moved since `parent` was read (someone else published).
    async commit({ parent, files, message }) {
      const parentCommit = await call('GET', `/git/commits/${parent}`)
      const entries = []
      for (const f of files) {
        const sha = f.blob ?? (await call('POST', '/git/blobs', { content: f.text, encoding: 'utf-8' })).sha
        entries.push({ path: f.path, mode: '100644', type: 'blob', sha })
      }
      const tree = await call('POST', '/git/trees', { base_tree: parentCommit.tree.sha, tree: entries })
      const commit = await call('POST', '/git/commits', { message, tree: tree.sha, parents: [parent] })
      try {
        await call('PATCH', `/git/refs/heads/${encodeURIComponent(branch)}`, { sha: commit.sha, force: false })
      } catch (e) {
        if (e.status === 422) throw new GitHubError(409, 'Branch moved during save')
        throw e
      }
      const blobFor = (path) => entries.find((e) => e.path === path)?.sha
      return { commit: commit.sha, blobFor }
    },

    async history(path, limit = 20) {
      const list = await call(
        'GET',
        `/commits?path=${encodeURIComponent(path)}&sha=${encodeURIComponent(branch)}&per_page=${limit}`,
      )
      return list.map((c) => ({
        sha: c.sha,
        message: c.commit.message.split('\n')[0],
        date: c.commit.committer?.date ?? c.commit.author?.date,
      }))
    },
  }
}
