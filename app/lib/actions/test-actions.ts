'use server'

// テスト用のシンプルなServer Action

export async function testAction(): Promise<string> {
  return 'Server Action動作テスト成功！'
}

export async function getCurrentTime(): Promise<string> {
  return new Date().toISOString()
}

export async function logMessage(message: string): Promise<void> {
  console.log(`[Server Action ログ] ${message}`)
} 