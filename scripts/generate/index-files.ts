import fs from 'fs/promises'
import path from 'path'

const targetDirs = ['']

const generateIndexFiles = async () => {
    for (const dir of targetDirs) {
        try {
            const files = await fs.readdir(dir)
            const indexPath = path.join(dir, 'index.ts')

            console.log(`\x1b[32mGenerating index file: ${indexPath}\x1b[0m`)

            const content = makeIndexContent(files)
            console.log(`\x1b[36m${content}\x1b[0m`)

            await fs.writeFile(indexPath, content)
            console.log(`\x1b[32m✅ Generated: ${indexPath}\x1b[0m`)
        } catch (error) {
            console.error(
                `\x1b[31m❌ Error processing ${dir}:`,
                error,
                '\x1b[0m'
            )
        }
    }
}

const makeIndexContent = (files: string[]) => {
    return (
        files
            .filter((file) => {
                // TypeScript/JSファイルのみを対象
                return /\.(ts|tsx)$/.test(file) && file !== 'index.ts'
            })
            .map((file) => {
                const baseName = file.replace(/\.(ts|tsx)$/, '')
                return `export * from './${baseName}'`
            })
            .join('\n') + (files.length > 0 ? '\n' : '')
    )
}

generateIndexFiles().catch(console.error)
