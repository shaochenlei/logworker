# LogWorker
This is a NodeJS implementation of log analytic tool, which read all logs of http respond time and get statistics of the following:   

1. 90% of requests return a response within X ms        
2. 95% of requests return a response within Y ms        
3. 99% of requests return a response within Z ms    

## Getting Started
A collection of logs have already been included in /var/log/httpd   
If you want to generate by yourself, you can run the following scripts. Notice that you need to install relative modules first by running yarn or npm install
```
yarn
node ./src/logGenerator.js
```

To run the main function and get the statistics, you may run 
```
node ./src/index.js
```

## Multi Thread Design
To make use of multiple cpu cores to accelerate log manipulation, I created a number of workers (threads) and dispatch logs evenly to them. After all the workers complete the jobs, the main thread collect the results and do a final calculation.
