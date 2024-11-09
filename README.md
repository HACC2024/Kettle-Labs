# Hawaii OpenData HACC

Chrome extension to augment `opendata.hawaii.gov`

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Chrome Web Browser](https://www.google.com/chrome/)



## Project Structure

* src/*: TypeScript source files
* public/*: static files
* dist: Chrome Extension build directory

## Setup

```shell
npm install

# compile production build
npm run build

# watch changes for local development
npm run watch
```

## Sample Queries
Try these queries out against the [unpaid-expenditures-for-hawaii-state-and-county-candidates](https://opendata.hawaii.gov/dataset/unpaid-expenditures-for-hawaii-state-and-county-candidates/resource/caf4dc69-cf11-43dc-b4f9-3c29156d7630) dataset:

#### top campaign spenders
```sql
with total_spend as (
  SELECT
    "Candidate Name" as name,
    sum("Unpaid Expenditure Amount"::MONEY) as spend 
  from "caf4dc69-cf11-43dc-b4f9-3c29156d7630" 
  group by 1 
)
SELECT
  row_number() over (order by spend desc nulls last) AS rank,
  name,
  spend 
from total_spend 
order by spend desc nulls last
limit 10
```

#### observe spend over time grouped by month
```sql
SELECT
  date_trunc('month', "Date")::DATE as month,
  sum("Unpaid Expenditure Amount"::MONEY) as spend
FROM "caf4dc69-cf11-43dc-b4f9-3c29156d7630"
GROUP BY month
order by month asc
```