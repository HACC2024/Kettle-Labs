# ![opendata-crx](public/images/icon-32.png "opendata.hawaii.gov") Hawaii OpenData HACC
![build](https://github.com/HACC2024/Kettle-Labs/workflows/build/badge.svg)

A chrome extension to unlock the full query capability of SQL on Hawaii's OpenData Portal `https://opendata.hawaii.gov/`.

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Chrome Web Browser](https://www.google.com/chrome/)



## Project Structure

* `src/*`: TypeScript source files
* `public/*`: static files
* `dist`: Chrome Extension build directory

## Setup Build

```shell
npm install

# compile production build
npm run build

# watch changes for local development
npm run watch
```

## Installation
![developer mode](public/load_unpacked.png "chrome://extensions")
To load an unpacked extension in developer mode:
1. Go to the Extensions page by entering `chrome://extensions` in a new tab. (By design `chrome://` URLs are not linkable.)
   * Alternatively, click the Extensions menu puzzle button and select **Manage Extensions** at the bottom of the menu.
   * Or, click the Chrome menu, hover over **More Tools**, then select **Extensions**.
2. Enable Developer Mode by clicking the toggle switch next to **Developer mode**.
3. Click the Load unpacked button and select the `/dist`.

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