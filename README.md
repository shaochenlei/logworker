# LogWorker
This is a NodeJS implementation of log analytic tool, which read all logs of http respond time and get statistics. A typical result is:

90% of requests return a response within 757 ms        
95% of requests return a response within 829 ms        
99% of requests return a response within 966 ms    

## Getting Started
A collection of logs have already been included in /var/log/httpd   
If you want to generate logs by yourself, you can run the following scripts. Notice that you need to install relative modules first by running yarn or npm install
```
yarn
node ./src/logGenerator.js
```

To run the main function and get the statistics, you may run 
```
node ./src/index.js
```

## Multi Thread Design
To make use of multiple cpu cores to accelerate log manipulation, I created a number of workers (threads) and dispatch logs evenly to them. After all the workers complete the jobs, the main thread collects the results and operate a final calculation.   


## Unit Test
Unit test of the core util functions are covered. 
```
yarn test
```