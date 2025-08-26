# First Step Printing Press - Official Website

This is the official web application for the First Step Printing Press, a modern, responsive portfolio website designed to showcase our wide range of printing services and products.

## Description

This project is a full-stack web application built with a Node.js backend and a static HTML, CSS, and JavaScript frontend. It features a dynamic, animated design, a live Instagram feed to display our latest work, and a fully functional contact form for customer inquiries.

The primary goal of this website is to provide an engaging and user-friendly experience for potential clients, highlighting our services from business cards and stationery to custom apparel and event props.

## Features

* **Fully Responsive Design:** Looks great on desktops, tablets, and mobile devices.
* **Dynamic Animated Background:** A vibrant, aurora-like gradient provides a modern and eye-catching aesthetic.
* **Interactive Service Cards:** Service and product cards have a 3D flip animation on hover or click to reveal pricing information.
* **Live Instagram Feed:** The "Our Work" section automatically fetches and displays the latest posts from our Instagram account via a secure backend.
* **"Load More" Functionality:** Users can load more Instagram posts to see a wider range of our work.
* **Functional Contact Form:** A secure contact form that sends inquiries directly to our business email using the SendGrid API.

## Technologies Used

### Frontend

* **HTML5**
* **CSS3** (with custom properties and animations)
* **Tailwind CSS** for utility-first styling.
* **JavaScript** for interactivity (mobile menu, flip cards, API calls).
* **Feather Icons** for clean, simple icons.
* **Google Fonts** for typography.

### Backend

* **Node.js**
* **Express.js** for the server and API routing.
* **Axios** for making HTTP requests to external APIs.
* **SendGrid Mail API** for reliably sending emails from the contact form.
* **Dotenv** for managing secret environment variables.

## Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/first-step-printing-press.git](https://github.com/your-username/first-step-printing-press.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd printing_press_app
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file** in the root of the project and add the following variables with your own keys:
    ```
    RAPIDAPI_KEY=your_rapidapi_key
    INSTAGRAM_USERNAME=your_instagram_username
    SENDGRID_API_KEY=your_sendgrid_api_key
    ```
5.  **Start the server:**
    ```bash
    npm start
    ```

The application will be running at `http://localhost:3000`.

## Acknowledgements

The backend of this website, including the server setup and API integrations, was custom-built. As I am still developing my skills in modern frontend design, I utilized AI assistance to help craft the HTML structure and the more complex CSS animations. This allowed me to focus on the backend logic while still achieving a polished and professional user interface.

