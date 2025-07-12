'use client';

import React, { useState } from 'react';
import { testSupabaseConnection } from '@/lib/supabase';

export function EnvironmentDebug() {
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

  const handleConnectionTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const success = await testSupabaseConnection();
      setTestResult(success ? '✅ 接続成功' : '❌ 接続失敗');
    } catch (error) {
      setTestResult(`❌ 接続エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-2">環境変数デバッグ</h3>
      <div className="space-y-2 text-sm mb-4">
        <div>
          <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {supabaseUrl ? '✅ 設定済み' : '❌ 未設定'}
        </div>
        <div>
          <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {supabaseAnonKey ? '✅ 設定済み' : '❌ 未設定'}
        </div>
        <div>
          <strong>NEXT_PUBLIC_APP_URL:</strong> {appUrl || '❌ 未設定'}
        </div>
        <div>
          <strong>NEXT_PUBLIC_ENVIRONMENT:</strong> {environment || '❌ 未設定'}
        </div>
      </div>
      
      <div className="border-t pt-4">
        <button
          onClick={handleConnectionTest}
          disabled={testing}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {testing ? 'テスト中...' : 'Supabase接続テスト'}
        </button>
        {testResult && (
          <div className="mt-2 text-sm">
            <strong>接続テスト結果:</strong> {testResult}
          </div>
        )}
      </div>
    </div>
  );
} 