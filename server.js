// server.js

// Import necessary packages
const express = require('express');
const axios = require('axios');
const sgMail = require('@sendgrid/mail'); // Import SendGrid
const path = require('path');
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// --- API ROUTES ---

/**
 * @route   GET /api/instagram
 * @desc    Securely fetches the latest Instagram posts using the Social Lens API.
 */
app.get('/api/instagram', async (req, res) => {
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const instagramUsername = process.env.INSTAGRAM_USERNAME;
    const paginationToken = req.query.token || null;

    if (!rapidApiKey || !instagramUsername) {
        return res.status(400).json({ error: 'RapidAPI key or Instagram username is not configured on the server.' });
    }

    const options = {
        method: 'GET',
        url: 'https://instagram-social-api.p.rapidapi.com/v1/posts',
        params: {
            username_or_id_or_url: instagramUsername,
            pagination_token: paginationToken 
        },
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'instagram-social-api.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const postsData = response.data.data.items;
        const newPaginationToken = response.data.pagination_token; 
        
        if (!Array.isArray(postsData)) {
             throw new Error("Received unexpected data format from the Instagram API.");
        }

        const formattedPosts = postsData.map(post => {
            const imageUrl = post.thumbnail_url;
            const permalink = `https://www.instagram.com/p/${post.code}/`;
            return { media_url: imageUrl, permalink: permalink, media_type: post.is_video ? 'VIDEO' : 'IMAGE' };
        });

        res.json({ posts: formattedPosts, nextToken: newPaginationToken });

    } catch (error) {
        console.error('Error fetching from RapidAPI (Instagram Social API):', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch Instagram posts from the new API.' });
    }
});

/**
 * @route   POST /api/contact
 * @desc    Handles contact form submission and sends an email using SendGrid.
 */
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // You must verify a "Single Sender" email address in your SendGrid account.
    // This will be the "from" address.
    const verifiedSenderEmail = 'firststepprinting0@gmail.com'; 

    const msg = {
        to: verifiedSenderEmail, // The email that receives the notification
        from: verifiedSenderEmail, // Your verified sender email
        subject: `New Contact Form Message from ${name}`,
        text: `You have a new message from your website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `<p>You have a new message from your website.</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully via SendGrid');
        res.status(200).json({ success: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email with SendGrid:', error);
        if (error.response) {
            console.error(error.response.body)
        }
        res.status(500).json({ error: 'Failed to send message.' });
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
