import React, { useEffect, useState } from 'react';
import {listTables} from './clients'


export const App = () => {
  const [results, setResults] = useState<string>()
  useEffect(() => {
    const handler = async () => {
      try{
        const results = await listTables()
        setResults(JSON.stringify(results, null, 2))
      } catch (e) {
        console.error(e)
      }
    }
  handler()
  }, [])

  return <div>
    Oh Hi, react here
    {results}
  </div>
}
