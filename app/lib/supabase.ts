import { createClient } from '@supabase/supabase-js';

// Supabaseの環境変数を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数が設定されていることを確認
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase環境変数が設定されていません。.env.localファイルを確認してください。\n' +
    'NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が必要です。'
  );
}

// Supabaseクライアントを作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// デバッグ用: 接続確認関数
export async function testSupabaseConnection() {
  try {
    const { error } = await supabase.from('tasks').select('count');
    if (error) {
      console.error('Supabase接続エラー:', error);
      return false;
    }
    console.log('Supabase接続成功');
    return true;
  } catch (error) {
    console.error('Supabase接続テスト失敗:', error);
    return false;
  }
} 