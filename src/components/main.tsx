'use client'

import { useState } from 'react'

import '~styles/globals.css'

export function Main({ name = 'Extension' }) {
    const [data, setData] = useState('')

    return (
        <div className="h-full w-full p-4">
            <div>
                <h1>
                    Welcome to your <a href="https://www.plasmo.com">Plasmo</a>{' '}
                    {name}!
                </h1>
                <input onChange={(e) => setData(e.target.value)} value={data} />
            </div>

            <a href="https://docs.plasmo.com">READ THE DOCS!</a>
        </div>
    )
}
