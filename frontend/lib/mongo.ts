import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL || ''
const dbName = process.env.MONGODB_DB || 'healthsync'

type Cached = {
  client: MongoClient
  db: ReturnType<MongoClient['db']>
}

declare global {
  // eslint-disable-next-line no-var
  var __HS_MONGO_CACHED: Cached | undefined
}

export async function getDb() {
  if (!uri) return null
  if (global.__HS_MONGO_CACHED) return global.__HS_MONGO_CACHED.db

  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db(dbName)
  global.__HS_MONGO_CACHED = { client, db }
  return db
}

export default getDb
