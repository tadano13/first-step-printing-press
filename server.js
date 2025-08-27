const express = require('express');
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const path = require('path');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
            let imageUrl = post.thumbnail_url;
            if (post.image_versions && post.image_versions.items && post.image_versions.items.length > 0) {
                imageUrl = post.image_versions.items[0].url;
            } else if (post.carousel_media && post.carousel_media.length > 0) {
                imageUrl = post.carousel_media[0].thumbnail_url;
            }

            const permalink = `https://www.instagram.com/p/${post.code}/`;

            return {
                media_url: imageUrl,
                permalink: permalink,
                media_type: post.is_video ? 'VIDEO' : 'IMAGE'
            };
        });

        res.json({ posts: formattedPosts, nextToken: newPaginationToken });

    } catch (error) {
        console.error('Error fetching from RapidAPI (Instagram Social API):', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch Instagram posts from the new API.' });
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const verifiedSenderEmail = 'your-verified-email@example.com'; 

    const msg = {
        to: verifiedSenderEmail,
        from: verifiedSenderEmail,
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
