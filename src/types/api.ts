export type SQLResult = {
  sql: string; // The SQL query that was run
  records: {
    [key: string]: any;
  }[];

  fields : {
    id : string;   // the name of the attribute in the record
    type : string; // the postgres type of the attribute
  }[]
}