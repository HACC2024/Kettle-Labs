import React from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';

type AppProps = {
  resourceId: string;
}

export const App = (props:AppProps) => {
  const sampleCode = `
  SELECT *
  FROM "${props.resourceId}"
  LIMIT 10
  `.replace(/^\s+|\s+$/g, ''); 


  return <>
    <CodeEditor
        value={sampleCode}
        language="sql"
        placeholder="Write some SQL..."
        padding={8}
        style={{
          backgroundColor: "#f5f5f5",
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
      <a className="btn btn-success">Run Query</a>
    </>;
}