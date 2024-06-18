const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Your MongoDB URI
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDB();

async function insertTV(req, res, params) {
    const { name, email, phone, city, model, tv_option, warranty_start_date, warranty_end_date } = params;

    try {
        const database = client.db('tvmanagement');
        const collection = database.collection('tvs');

        const tv = {
            name,
            email,
            phone,
            city,
            model,
            tv_option,
            warranty_start_date: new Date(warranty_start_date),
            warranty_end_date: new Date(warranty_end_date),
        };

        const result = await collection.insertOne(tv);
        console.log(`${result.insertedCount} TV inserted`);

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('TV added successfully');
    } catch (error) {
        console.error('Error inserting TV:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function deleteTV(req, res, params) {
    const { name, model } = params;
    try {
        const database = client.db('tvmanagement');
        const collection = database.collection('tvs');

        const filter = { name, model };

        const result = await collection.deleteOne(filter);
        console.log(`${result.deletedCount} TV deleted`);

        if (result.deletedCount === 1) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('TV deleted successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('TV not found');
        }
    } catch (error) {
        console.error('Error deleting TV:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function updateTV(req, res, params) {
    const { name, model, warranty_start_date, warranty_end_date } = params;

    try {
        const database = client.db('tvmanagement');
        const collection = database.collection('tvs');

        const filter = { name, model };

        const updateDoc = {
            $set: {
                warranty_start_date: new Date(warranty_start_date),
                warranty_end_date: new Date(warranty_end_date)
            }
        };

        const result = await collection.updateOne(filter, updateDoc);
        console.log(`${result.modifiedCount} TV updated`);

        if (result.modifiedCount === 1) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('TV updated successfully');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('TV not found');
        }
    } catch (error) {
        console.error('Error updating TV:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function displayTV(req, res, params) {
    const { name, model } = params;
    try {
        const database = client.db('tvmanagement');
        const collection = database.collection('tvs');

        const filter = { name, model };
        const tvs = await collection.find(filter).toArray();

        if (tvs.length > 0) {
            const formatDate = (date) => {
                const d = new Date(date);
                const year = d.getFullYear();
                const month = ('0' + (d.getMonth() + 1)).slice(-2);
                const day = ('0' + d.getDate()).slice(-2);
                return `${year}-${month}-${day}`;
            };

            let htmlResponse = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>TV Details</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f0f8ff;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                        }
                        .container {
                            max-width: 600px;
                            width: 100%;
                            background-color: #ffffff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            border-radius: 8px;
                            overflow: hidden;
                            padding: 20px;
                        }
                        .header {
                            background-color: #007bff;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            font-size: 24px;
                        }
                        .tv-info {
                            margin: 10px 0;
                            font-size: 18px;
                        }
                        .tv-info span {
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">TV Details</div>`;

            tvs.forEach(tv => {
                htmlResponse += `
                    <div class="tv-info"><span>Name:</span> ${tv.name}</div>
                    <div class="tv-info"><span>Email:</span> ${tv.email}</div>
                    <div class="tv-info"><span>Phone:</span> ${tv.phone}</div>
                    <div class="tv-info"><span>City:</span> ${tv.city}</div>
                    <div class="tv-info"><span>Model:</span> ${tv.model}</div>
                    <div class="tv-info"><span>TV Option:</span> ${tv.tv_option}</div>
                    <div class="tv-info"><span>Warranty Start Date:</span> ${formatDate(tv.warranty_start_date)}</div>
                    <div class="tv-info"><span>Warranty End Date:</span> ${formatDate(tv.warranty_end_date)}</div>
                    <hr>`;
            });

            htmlResponse += `
                    </div>
                </body>
                </html>
            `;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlResponse);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('TV not found');
        }
    } catch (error) {
        console.error('Error displaying TV:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

async function onRequest(req, res) {
    const path = url.parse(req.url).pathname;
    console.log('Request for ' + path + ' received');

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        const params = querystring.parse(body);

        if (path === '/insert') {
            insertTV(req, res, params);
        } else if (path === '/delete') {
            deleteTV(req, res, params);
        } else if (path === '/update') {
            updateTV(req, res, params);
        } else if (path === '/display') {
            displayTV(req, res, params);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Invalid endpoint');
        }
    });
}

http.createServer(onRequest).listen(8099, () => {
    console.log('Server is running on port 8099');
});
