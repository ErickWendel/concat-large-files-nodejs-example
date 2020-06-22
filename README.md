# concat-large-files

This repo is an example about how to concat large files using Node.js

## Running

Restore dependencies with `npm install`

1. There are the producer data in [./produceData](./produceData) that will create files with 300K items+. Run `npm run create-files` to produce these files on [./files](./files). It uses the `child_processes` module to process data in parallel in different files.

2. There are the concatener in [./index.js](index.js) that will concat all `.csv` files and generate the `final.csv` file with all entries. It will convert data from csv, on `name` field it will replace spaces by underscore ( `_` ) then convert to csv again and finally save its output on `final.csv`.

