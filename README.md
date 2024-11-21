# Setup Instructions

1. Download the zip of this project or utilize git commands to clone this project
  - To download the zip click on the green code button the click download zip
    
2. If project does not contain dependencies when pulled down follow steps
3 - 5 otherwise skip to step 6

3. Install Node.js according to the instructions on the official website: \
https://nodejs.org/en/download/package-manager

4. Install ngrok according to instructions on the official website \
https://download.ngrok.com/mac-os

5. Install express and axios with the following command: \
```npm install express axios```

6. In the project folder run the following command to start the server \
```node server/server.js```

7. The following message should show if server is run successfully \
```Server is running on http://localhost:3000```

8. In another terminal/powershell instance run the following command: \
```ngrok http 3000```

This allows forwarding of data from the internet to the local server

9. After ngrok runs copy the url found after the Forwarding line and add /webhook to the end \
ex: https://1234-5679-1235.ngrok-free.app/webhook

add this url to the webhook action in GoHighLevel in the Skip Tracing workflow

10. After a trigger occurs data will be sent to batchdata. Results from batch 
data will appear in batchDataResults.txt in the GoHighLevel project folder



Currently attempting to route data back from BatchData back to GoHighLevel
does not execute successfully
