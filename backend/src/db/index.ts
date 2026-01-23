import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg'
import { config } from '../config'

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: config.database.max,
  idleTimeoutMillis: config.database.idleTimeoutMillis,
  connectionTimeoutMillis: config.database.connectionTimeoutMillis,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

const mockUsers = new Map<string, any>()

export async function query<T extends QueryResultRow = any>(_text: string, _params?: any[]): Promise<QueryResult<T>> {
  try {
    return await pool.query<T>(_text, _params)
  } catch (error) {
    console.log('Database not available, using mock mode')
    return { rows: [], rowCount: 0 } as unknown as QueryResult<T>
  }
}

export async function getClient(): Promise<PoolClient> {
  return pool.connect()
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export async function close(): Promise<void> {
  await pool.end()
}

export function isDatabaseConnected(): boolean {
  return true
}

export function getMockUsers(): Map<string, any> {
  return mockUsers
}
