# Chrome拡張機能 リンクコピー機能 要件定義書

## 1. プロジェクト概要

### 1.1 プロジェクト名

**Smart Link Copier** - ウェブサイトリンク書式コピー拡張機能

### 1.2 目的・背景

- ウェブサイト上のリンクを書式付きでコピーする機能を提供
- SlackやDiscordなどのチャットツールにリンク付きテキストを簡単にペーストできるようにする
- ユーザビリティの向上により、業務効率を改善する

### 1.3 対象ユーザー

- Slack、Discord、Teamsなどのコミュニケーションツールを日常的に使用するビジネスパーソン
- リンク共有を頻繁に行う開発者、マーケター、コンテンツクリエイター
- 書式付きテキストでの情報共有を重視するユーザー

## 2. 機能要件

### 2.1 コア機能

#### 2.1.1 リンク検出機能

- **概要**: ウェブページ上のすべてのリンク（`<a>`タグ）を自動検出
- **詳細**:
    - 動的に追加されるリンクも検出（MutationObserver使用）
    - 外部リンク、内部リンク問わず検出
    - 画像リンク、テキストリンクの両方を対象

#### 2.1.2 コピーアイコン表示機能

- **概要**: 検出したリンクの近くにコピーアイコンを表示
- **詳細**:
    - リンクにホバーした際にアイコンを表示
    - アイコンデザイン: クリップボードアイコン（16x16px）
    - 位置: リンクの右上に配置
    - スタイル: 半透明背景、ホバー時に不透明化

#### 2.1.3 書式コピー機能

- **概要**: アイコンクリック時に書式付きでリンクをクリップボードにコピー
- **サポート形式**:
    1. **Markdownフォーマット**: `[リンクテキスト](URL)`
    2. **Slackフォーマット**: `<URL|リンクテキスト>`
    3. **HTMLフォーマット**: `<a href="URL">リンクテキスト</a>`
    4. **プレーンテキスト**: `リンクテキスト - URL`

#### 2.1.4 設定管理機能

- **概要**: ユーザーが書式を選択できる設定画面
- **詳細**:
    - ポップアップでデフォルト形式を設定
    - ショートカットキーでの形式切り替え
    - 除外サイトの設定

### 2.2 UI/UX機能

#### 2.2.1 フィードバック機能

- コピー成功時のトースト通知表示
- アニメーション効果（アイコンの一時的なハイライト）
- 音声フィードバック（オプション）

#### 2.2.2 ショートカット機能

- `Ctrl+Shift+C`（Windows）/ `Cmd+Shift+C`（Mac）でホバー中のリンクをコピー
- 設定画面でのカスタマイズ可能

## 3. 技術要件

### 3.1 使用技術スタック

- **フレームワーク**: Plasmo Framework
- **フロントエンド**: React 18+
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS（推奨）
- **バンドラー**: Plasmo内蔵（Webpack/Parcel）

### 3.2 Chrome拡張機能仕様

- **Manifest Version**: 3
- **必要な権限**:
    - `activeTab`: アクティブタブへのアクセス
    - `storage`: 設定データの保存
    - `clipboardWrite`: クリップボードへの書き込み
- **コンテンツスクリプト**: 全サイトで動作
- **バックグラウンドスクリプト**: 設定管理とメッセージングに使用

### 3.3 ファイル構成

```
src/
├── contents/           # Content Scripts
│   └── link-copier.tsx # メイン機能
├── background/         # Background Scripts
│   └── index.ts       # 設定管理
├── popup/             # Popup UI
│   └── index.tsx      # 設定画面
├── assets/            # 静的ファイル
│   └── icon.png       # 拡張機能アイコン
├── styles/            # スタイルファイル
│   └── global.css     # グローバルスタイル
└── types/             # TypeScript型定義
    └── index.ts       # 共通型定義
```

## 4. 実装仕様

### 4.1 Content Script実装

#### 4.1.1 リンク検出ロジック

```ts
// PlasmoCSConfig設定
export const config: PlasmoCSConfig = {
    matches: ['<all_urls>'],
    all_frames: true,
}

// MutationObserverでのリンク監視
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
                processNewLinks(node.querySelectorAll('a'))
            }
        })
    })
})
```

#### 4.1.2 コピーアイコンコンポーネント

```tsx
interface CopyIconProps {
    link: HTMLAnchorElement
    format: CopyFormat
}

const CopyIcon: React.FC<CopyIconProps> = ({ link, format }) => {
    const handleCopy = async () => {
        const formattedText = formatLink(link, format)
        await navigator.clipboard.writeText(formattedText)
        showToast('リンクをコピーしました')
    }

    return (
        <div className="copy-icon" onClick={handleCopy}>
            <ClipboardIcon />
        </div>
    )
}
```

### 4.2 フォーマット変換

#### 4.2.1 書式変換関数

```typescript
type CopyFormat = 'markdown' | 'slack' | 'html' | 'plain'

const formatLink = (link: HTMLAnchorElement, format: CopyFormat): string => {
    const url = link.href
    const text = link.textContent || link.title || url

    switch (format) {
        case 'markdown':
            return `[${text}](${url})`
        case 'slack':
            return `<${url}|${text}>`
        case 'html':
            return `<a href="${url}">${text}</a>`
        case 'plain':
            return `${text} - ${url}`
        default:
            return url
    }
}
```

### 4.3 設定管理

#### 4.3.1 Storage API使用

```ts
import { useStorage } from '@plasmohq/storage/hook'

interface Settings {
    defaultFormat: CopyFormat
    excludedSites: string[]
    shortcutKey: string
    showNotifications: boolean
}

const useSettings = () => {
    const [settings, setSettings] = useStorage<Settings>('settings', {
        defaultFormat: 'markdown',
        excludedSites: [],
        shortcutKey: 'Ctrl+Shift+C',
        showNotifications: true,
    })

    return { settings, setSettings }
}
```

## 5. パフォーマンス要件

### 5.1 応答性能

- アイコン表示までの遅延: 100ms以下
- コピー処理完了: 200ms以下
- メモリ使用量: 5MB以下

### 5.2 互換性

- Chrome 88以降をサポート
- 主要なWebサイト（Google、GitHub、Stack Overflow等）での動作確認
- SPAサイトでの正常動作

## 6. セキュリティ要件

### 6.1 データ保護

- ユーザーデータの暗号化は不要（設定データのみ）
- 外部サーバーへのデータ送信は行わない
- ローカルストレージのみ使用

### 6.2 権限最小化

- 必要最小限の権限のみ要求
- 明確な権限説明をユーザーに提示

## 7. テスト要件

### 7.1 単体テスト

- フォーマット変換関数のテスト
- リンク検出ロジックのテスト
- 設定管理機能のテスト

### 7.2 統合テスト

- 主要Webサイトでの動作確認
- 異なるリンクタイプでのテスト
- パフォーマンステスト

## 8. 運用要件

### 8.1 配布方法

- Chrome Web Storeでの公開（将来的）
- 開発版は手動インストール

### 8.2 更新・メンテナンス

- 定期的なChrome APIの互換性確認
- ユーザーフィードバックに基づく機能改善
- セキュリティアップデートの実施

## 9. 今後の拡張可能性

### 9.1 追加機能

- Firefox、Edge対応
- カスタム書式テンプレート機能
- 一括リンクコピー機能
- リンクプレビュー機能

### 9.2 連携機能

- 他の生産性ツールとの連携
- APIを通じた外部サービス連携

## 10. 制約事項

### 10.1 技術的制約

- Chrome拡張機能のセキュリティポリシーに準拠
- Content Security Policy (CSP) の制限
- クロスオリジン制約

### 10.2 ユーザビリティ制約

- ウェブサイトのデザインを可能な限り損なわない
- パフォーマンスへの影響を最小限に抑制

---

この要件定義書に基づいて、Claude Codeでの実装を進めてください。各機能の詳細な実装方法や技術的な質問があれば、お気軽にご相談ください。
