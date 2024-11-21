const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;
const fs = require('fs');

// Middleware to parse JSON bodies
app.use(express.json());

const GO_HIGH_LEVEL_API_KEY = 'pit-699255dd-58c0-4375-9841-4a8129c11634';
let GO_HIGH_LEVEL_CONTACT_ID = ''; // Initialize with an empty string

// Store Contact ID from GoHighLevel
app.post('/webhook', async (req, res) => {
  const data = req.body;
  console.log("Received data from GoHighLevel", data);


  try {

    // Parse data into relevant fields 
    const {contact_id, address1, city, state, postal_code} = data;

    // Validate incoming data
    if (!contact_id || !address1 || !city || !state || !postal_code) {
        console.log("Missing required address fields", contact_id, address1, city, state, postal_code);
        return res.status(400).send({ message: 'Missing required address fields' });
    }
    GO_HIGH_LEVEL_CONTACT_ID = contact_id; // Store contact id
    console.log("Contact ID: ", GO_HIGH_LEVEL_CONTACT_ID);

    // Construct payload to match BatchData api request format
    const batchDataPayload = {
        requests: [
            {
                propertyAddress: {
                    street: address1,
                    city: city,
                    state: state,
                    zip: postal_code
                }
            }
        ]
    };

    // Send the data to BatchData API
    const batchDataResponse = await axios.post(
        'https://api.batchdata.com/api/v1/property/skip-trace',
        batchDataPayload,
        {
            headers: {
                'Authorization': 'Bearer riBrsGChDUXYuLdx5DibNB8k5J0WhVtD0MFQ0pOa', // Server side token
                // 'Authorization': 'Bearer j9FTCY8itXcdqXOZYKSlDRzUBWcPMcKOUh0UmPbo', // Sandbox token
                'Content-Type': 'application/json',
            },
            timeout: 5000, // 5-second timeout
        }
    );

    // const batchDataResults = batchDataResponse.data.results
    const batchDataResults = batchDataResponse.data.results.persons;

    // Write results to a text file
    const filePath = './batchDataResults.txt';
    fs.writeFileSync(filePath, JSON.stringify(batchDataResults, null, 2), 'utf-8');
    console.log(`BatchData results saved to ${filePath}`);

    // console.log("BatchData results: ", batchDataResults);
    console.log("BatchData results: " + JSON.stringify(batchDataResults, null, 2));

    // console.log("Name: ", batchDataResults.name);
    // console.log("Email: ", batchDataResults.emails.email);
    // console.log("Phone Numbers: ", batchDataResults.phoneNumbers.number);

    // Forward the response back to GoHighLevel
    const goHighLevelResponse = await axios.post(
        `https://services.leadconnectorhq.com/contacts/${GO_HIGH_LEVEL_CONTACT_ID}`, // GoHighLevel Contact Update API
        {
            
            // Map BatchData fields to GoHighLevel fields here
            name: batchDataResults.name,
            email: batchDataResults.email,
            phone: batchDataResults.phoneNumbers
            // skipTraceResult: JSON.stringify(batchDataResults), 
            
        },
        {
            headers: {
                'Authorization': 'Bearer pit-699255dd-58c0-4375-9841-4a8129c11634', 
                'Content-Type': 'application/json',
            },
        }
    );

        console.log("Batch Data: " , data);
        // Respond to webhook with success
        res.status(200).send({
            message: 'Data processed and forwarded successfully',
            batchDataResponse: batchDataResults,
            goHighLevelResponse: goHighLevelResponse.data,
        });
    } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error processing data', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});