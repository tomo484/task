# モジュール解決問題 トラブルシューティングガイド

## 📋 **問題概要**

pnpmで依存関係を追加したにも関わらず、TypeScriptエラーが継続的に発生する問題の解決記録。

---

## 🚨 **発生したエラー**

### エラー内容
```
Cannot find module '@supabase/supabase-js' or its corresponding type declarations
Cannot find module 'date-fns/locale' or its corresponding type declarations.
```

### 影響範囲
- `app/lib/supabase.ts`
- `app/lib/utils.ts` 
- その他の依存関係を使用するファイル

---

## 🔧 **実行した対策（エラーが継続）**

### ユーザーが事前に実行済み
- ✅ プロジェクトのクリーンアップ
- ✅ 指定ライブラリの再インストール

### 追加で実行した対策

#### 1. pnpmキャッシュの完全クリア
```bash
pnpm store prune
```
**結果**: 50ファイル、3パッケージを削除

#### 2. node_modulesの完全削除・再作成
```bash
rm -rf node_modules
rm -f pnpm-lock.yaml
pnpm install
```

#### 3. 依存関係インストール確認
- ✅ @supabase/supabase-js 2.50.0
- ✅ clsx 2.1.1
- ✅ date-fns 4.1.0
- ✅ tailwind-merge 3.3.1

#### 4. TypeScript設定確認
- ✅ tsconfig.json正常
- ✅ 必要な型定義パッケージ存在確認

**結果**: **しかし、エディタ上でエラーが継続**

---

## 🎯 **最終的に判明した問題**

### 真の原因
**エディタ（VSCode/Cursor）のTypeScript Language Serverキャッシュ問題**

### 証拠
- ✅ **TypeScriptコンパイラー**: `npx tsc --noEmit` → **エラーなし**
- ✅ **開発サーバー**: `pnpm run dev` → **正常起動（1552ms）**
- ✅ **依存関係**: node_modules内に正常インストール確認済み
- ❌ **エディタ表示**: 依然としてエラー表示

### 結論
実際にはモジュール解決は正常に動作しており、**エディタのTypeScript Language Serverが古いキャッシュを保持していることが問題**。

---

## 🛠️ **最終解決策**

### 実装済み対策
1. **VSCode設定の最適化**
   - `.vscode/settings.json`作成
   ```json
   {
     "typescript.preferences.includePackageJsonAutoImports": "on",
     "typescript.suggest.autoImports": true,
     "typescript.updateImportsOnFileMove.enabled": "always",
     "typescript.workspaceSymbols.scope": "allOpenProjects"
   }
   ```

### ユーザー実行必要
1. **TypeScript Language Server再起動**
   - `Ctrl+Shift+P` (Windows/Linux) または `Cmd+Shift+P` (Mac)
   - `TypeScript: Restart TS Server` を実行

2. **エディタ完全再起動**
   - VSCode/Cursor を完全に閉じて再起動

3. **Alternative: Extension Host再起動**
   - `Ctrl+Shift+P` → `Developer: Restart Extension Host`

---

## 📚 **このケースの教訓**

### 重要なポイント
- 依存関係の大幅な変更後は、パッケージマネージャーレベルでは問題が解決されていても、**エディタキャッシュが古い状態を保持する**ことがある
- TypeScriptコンパイラーで正常動作している場合は、エディタキャッシュクリアが有効な解決策
- `skipLibCheck: true`が設定されていても、エディタレベルでは影響しない場合がある

### デバッグ手順
1. まず`npx tsc --noEmit`でコンパイラーレベルの確認
2. 開発サーバーが正常起動するか確認
3. node_modules内のパッケージ存在確認
4. 上記が全て正常なら→エディタキャッシュ問題

---

## 🔄 **再発防止策**

### 今後同様の問題が発生した場合
1. **第一段階**: パッケージマネージャーレベル
   ```bash
   pnpm store prune
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **第二段階**: TypeScriptコンパイラー確認
   ```bash
   npx tsc --noEmit
   ```

3. **第三段階**: エディタキャッシュクリア
   - TypeScript Language Server再起動
   - エディタ完全再起動

### 予防策
- 大幅な依存関係変更後は、積極的にエディタ再起動を実行
- プロジェクト設定ファイル（.vscode/settings.json）の適切な設定

---

**作成日**: 2024年6月12日  
**解決日**: 2024年6月12日  
**対象プロジェクト**: my-next-app  
**パッケージマネージャー**: pnpm v10.12.1 