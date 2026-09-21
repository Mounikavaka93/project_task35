import fs from 'fs'
import path from 'path'

const root = 'd:/project_task35/src'
const pattern = /https:\/\/images\.unsplash\.com\/(photo-[a-z0-9-]+)\?[^'"`\s)]+/g

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) {
      walk(full)
      continue
    }
    if (!/\.(js|jsx)$/.test(name)) continue
    const before = fs.readFileSync(full, 'utf8')
    const after = before.replace(pattern, '/images/$1.jpg')
    if (after !== before) {
      fs.writeFileSync(full, after)
      console.log('updated', full)
    }
  }
}

walk(root)
