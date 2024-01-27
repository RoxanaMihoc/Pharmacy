const fs = require('fs');
const { MongoClient } = require('mongodb');
const path = require('path');

// MongoDB connection string
const mongoUri = 'mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Users?retryWrites=true&w=majority'; // Replace with your MongoDB connection string

// Specify the path to your folder containing JSON files
const folderPath = './database/';

// Create a MongoDB client
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to process a JSON file
async function processJsonFile(filePath, collection) {
    try {
        // Read the JSON file
        const data = fs.readFileSync(filePath, 'utf8');

        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Extract the array from the JSON data
        const itemsArray = jsonData.items; // Change 'items' to your actual key

        // Iterate through each item in the array
        for (const item of itemsArray) {
            // Remove everything after '#PB-' in the description field if it's present
            if (item.description && item.description.includes('#PB-')) {
                item.description = item.description.split('#PB-')[0].trim();
            }

            // Insert the item into the MongoDB collection
            await collection.insertOne(item);
        }

        console.log(`Items from ${filePath} added to MongoDB successfully.`);
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
}

// Connect to the MongoDB server
client.connect().then(async () => {
    try {
        // Get the MongoDB database
        const database = client.db('Products'); // Replace with your actual database name

        // Get the MongoDB collection
        const collection = database.collection('products'); // Replace with your actual collection name

        // Read the contents of the folder
        const files = fs.readdirSync(folderPath);

        // Filter out only JSON files
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

        // Process each JSON file
        for (const jsonFile of jsonFiles) {
            const filePath = path.join(folderPath, jsonFile);
            await processJsonFile(filePath, collection);
        }

        console.log('All JSON files processed and items added to MongoDB successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        // Close the MongoDB client
        await client.close();
    }
});

