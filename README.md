Install Node.js according to the instructions on the official website
https://nodejs.org/en/download/package-manager

Install ngrok according to instructions on the official website
https://download.ngrok.com/mac-os

Install express and axios with the following command:
```npm install express axios```

In the server folder run the following command to start the server
```node server.js```

The following message should show if server is run successfully
```Server is running on http://localhost:3000```

In another terminal/powershell instance run the following command:
```ngrok http 3000```

This allows forwarding of data from the internet to the local server

after ngrok runs copy the url found after the Forwarding line and add /webhook to the end
ex: https://1234-5679-1235.ngrok-free.app/webhook

add this url to the webhook action in GoHighLevel

After a trigger occurs data will be sent to batchdata. Results from batch 
data will appear in batchDataResults.txt in the GoHighLevel project folder

Currently attempting to route data back from BatchData back to GoHighLevel
does not execute successfully
