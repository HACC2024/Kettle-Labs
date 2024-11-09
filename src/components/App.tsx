import React, { useEffect, useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { ResultTable } from "./ResultTable";
import { SQLResult } from "../types/api";

type AppProps = {
  resourceId: string;
  track? : (event: string, data: any) => void;
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
  let sampleQuery = `
  SELECT *
  FROM "${props.resourceId}"
  LIMIT 10
  `.replace(/^\s+|\s+$/g, '');

  useEffect(function componentDidMount() {
    chrome.storage.sync.get([props.resourceId])
      .then(function(result) {
        if (result[props.resourceId]) {
          sampleQuery = result[props.resourceId];
          setQuery(sampleQuery);
        }
      })
      .catch(function(err) {
        // ignore error, just set the default sample query prevail
        console.error(err);
      });
  }, [props.resourceId]);

  const [query, setQuery] = useState(sampleQuery);
  const [result, setResult] = useState(null as SQLResult|null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function runQuery() {
    setLoading(true);
    props.track && props.track('run_query', { resourceId : props.resourceId, query } );
    fetch(`/api/3/action/datastore_search_sql?sql=${encodeURIComponent(minifySQL(query))}`)
      .then(async response => {
        const data = await response.json();
        setSuccess(data.success || data.error);
        setResult(data.result);
      })
      .catch(err => {
        console.error(err);
        setResult(err as any);
        setSuccess(false);
      })
      .finally(() => {setLoading(false) });
  }

  function saveQuery() {
    setLoading(true);
    chrome.storage.sync.set({[props.resourceId]: query}, function() {
      setLoading(false);
    });
  }

  function reset() {
    setLoading(true);
    chrome.storage.sync.remove([props.resourceId]).finally(() => {
      setQuery(sampleQuery);
      setResult(null);
      setSuccess(false);
      setLoading(false);
    });
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
            value={result ? JSON.stringify(result, null, 2) : ''}
            language="json"
            placeholder="Results will be shown here..."
            padding={8}
            contentEditable={false}
          />
      </div>
    </div>
    
    <div className="query-actions">
      <a className={`btn btn-primary ${loading ? 'disabled' : ''}`} href="#" onClick={runQuery}>
        <i className="fa fa-lg fa-play-circle"></i>
        Submit Query
      </a>
      <a className={`btn btn-default ${loading ? 'disabled' : ''}`} href="#" onClick={saveQuery}>
      <i className="fa fa-lg fa-save"></i>
        Save Query
      </a>
      <a className={`btn btn-danger ${loading ? 'disabled' : ''}`} href="#" onClick={reset}>
        <i className="fa fa-lg fa-undo"></i>
        Reset
      </a>
    </div>

    
    { success && result && <ResultTable success={success} result={result} /> }
    </>;
}