import React, { useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { ResultTable, type SQLResult } from "./components/ResultTable";

type AppProps = {
  resourceId: string;
}

function minifySQL(sql: string): string {
  // Remove line breaks and extra whitespace
  let minified = sql
    .replace(/--.*?(\r?\n|$)/g, ' ')      // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, ' ')     // Remove multi-line comments
    .replace(/\s+/g, ' ')                  // Collapse all whitespace into single space
    .trim();                               // Remove leading and trailing whitespace

  return minified;
}

export const App = (props:AppProps) => {
  const sampleQuery = `
  SELECT *
  FROM "${props.resourceId}"
  LIMIT 10
  `.replace(/^\s+|\s+$/g, '');

  const [query, setQuery] = useState(sampleQuery);
  const [result, setResult] = useState(null as SQLResult|null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function runQuery() {
    fetch(`/api/3/action/datastore_search_sql?sql=${encodeURIComponent(minifySQL(query))}`)
      .then(async response => {
        const data = await response.json();
        setSuccess(data.success);
        setResult(data.result);
      })
      .catch(err => {
        console.error(err);
        setResult(err as any);
        setSuccess(false);
      });
  }

  function reset() {
    setQuery(sampleQuery);
    setResult(null);
    setSuccess(false);
  }

  return <>
    <div className="grid-container">
      <div className="grid-item">
        <CodeEditor
            value={query}
            language="sql"
            placeholder="Write some SQL..."
            padding={8}
            onChange={(ev) => setQuery(ev.target.value)}
          />
        </div>
      <div className="grid-item">
        <CodeEditor
            className="grid-item"
            value={result ? JSON.stringify(result, null, 2) : ''}
            language="json"
            placeholder="Results will be shown here..."
            padding={8}
            contentEditable={false}
          />
      </div>
    </div>
    
    <div className="query-actions">
      <a className="btn btn-primary" href="#" onClick={runQuery}>Submit Query</a>
      <a className="btn btn-default" href="#">Save</a>
      <a className="btn btn-danger" href="#" onClick={reset}>Reset</a>
    </div>

    
    { success && result && <ResultTable success={success} result={result} /> }
    </>;
}