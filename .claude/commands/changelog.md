---
description: Update CHANGELOG.md with git commit history based on package.json version
tags:
    - project
    - changelog
    - git
---

# CHANGELOG更新コマンド

package.jsonのバージョンに基づいて、変更履歴をCHANGELOG.mdに追加します。

## タスク

### 1. バージョンの取得と範囲の決定

- package.jsonからバージョンを読み取る（サフィックスを含むそのままの値を使用）
- 前のバージョンを自動検出（gitタグから取得、なければ最初のコミットから）
- バージョン範囲: `前のバージョン..現在のバージョン`

### 2. バージョンの確認

- CHANGELOG.mdに既に同じバージョンのエントリが存在する場合は警告を表示
- 存在する場合は処理を中止するか、ユーザーに確認を求める

### 3. Gitコミット履歴と差分の取得

以下のコマンドでコミット履歴を取得：

```bash
git log --pretty=format:"%h - %s (%ci)" <前のバージョン>..<現在のバージョン>
```

前のバージョンのタグが存在しない場合は、すべてのコミット履歴を取得：

```bash
git log --pretty=format:"%h - %s (%ci)"
```

**差分の確認**:
各バージョン範囲の差分も確認して、実際の変更内容を把握します：

```bash
git diff <前のバージョン>..<現在のバージョン> --stat
git diff <前のバージョン>..<現在のバージョン>
```

前のバージョンのタグが存在しない場合は、最初のコミットからの差分を確認：

```bash
git diff $(git rev-list --max-parents=0 HEAD)..HEAD --stat
git diff $(git rev-list --max-parents=0 HEAD)..HEAD
```

差分から以下を確認：

- 新規追加されたファイル
- 削除されたファイル
- 大幅に変更されたファイル
- 設定ファイルの変更

### 4. コミットの分類

コミットメッセージのプレフィックスと差分内容の両方を考慮して分類：

- **Added** (新機能):
    - `feat:`, `add:`で始まるコミット
    - 差分で新規ファイルが追加されている場合

- **Changed** (変更):
    - `refactor:`, `chore:`, `style:`, `docs:`, `perf:`, `update:`で始まるコミット
    - 既存ファイルの大幅な変更

- **Fixed** (修正):
    - `fix:`で始まるコミット
    - バグ修正を示す差分

- **Removed** (削除):
    - `remove:`, `delete:`で始まるコミット
    - 差分でファイルが削除されている場合

- **Deprecated** (非推奨):
    - `deprecate:`で始まるコミット

- **Security** (セキュリティ):
    - `security:`で始まるコミット
    - セキュリティ関連の依存関係の更新

プレフィックスがない場合は、コミットメッセージと差分内容から推測するか、Changedに分類します。

### 5. CHANGELOG.mdの更新

以下のフォーマットでCHANGELOG.mdに新しいバージョンセクションを追加：

```markdown
## [package.jsonのバージョン] - YYYY-MM-DD

### Added

- 機能の説明 (コミットハッシュ)

### Changed

- 変更の説明 (コミットハッシュ)

### Fixed

- 修正の説明 (コミットハッシュ)
```

**重要**:

- Unreleasedセクションを削除し、新しいバージョンセクションに置き換える
- 日付は今日の日付を使用
- カテゴリにエントリがない場合は、そのカテゴリセクションを省略
- コミットメッセージからプレフィックス（feat:, fix: など）を削除して読みやすくする

### 6. 確認と出力

- 更新後のCHANGELOGの該当セクションを表示
- gitタグの作成を提案（まだ作成されていない場合）

## 実行例

```
/changelog
```

上記のコマンドで、package.jsonのバージョンに基づいてCHANGELOG.mdを更新します。

## 注意事項

- このコマンドはCHANGELOG.mdを直接編集します
- 実行前に現在のCHANGELOG.mdの内容を確認します
- 既に同じバージョンのエントリが存在する場合は警告します
- コミットメッセージの品質によって出力の品質が変わります
