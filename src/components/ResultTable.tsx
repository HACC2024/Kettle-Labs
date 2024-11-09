import React from "react";
import { SQLResult } from "../types/api";

type ResultTableProps = {
  success: boolean;
  result: SQLResult;
}


export const ResultTable = (props:ResultTableProps) => {
  if (!props.success) {
    return <div>No results</div>;
  }

  // get all column names, omit the "_full_text" column
  const columns = props.result.fields.map(field => field.id).filter(id => id !== '_full_text');
  return <div className="dataTables_scroll result-table">
    <div className="dataTables_scrollBody">
      <table className="table table-striped table-bordered dataTable no-footer">
        <thead>
          <tr role="row">
            {columns.map((columnId, index) => <th scope="col" key={index}>{columnId}</th>)}
          </tr>
        </thead>
        <tbody>
        {props.result.records.map((record, index) => <tr key={index} className={index % 2 ? 'even' : 'odd'}>
          {columns.map((column, index) => <td key={index}>{record[column]}</td>)}
        </tr>)}
      </tbody>
      </table>
    </div>
  </div>;
}
