# Bookmarklet

## Overview

**TrustClip Bookmarklet** allows users to quickly highlight and send selected text directly from a webpage. This tool is designed to enhance user interaction with trust management tools by making it simple to copy, verify, and interact with content in real-time.

The **Bookmarklet** project is a lightweight JavaScript utility designed to extract selected text from any webpage and send it to a backend API for processing.

It is particularly useful for applications that require quick data collection from online articles, such as claim processing or content analysis.

## Features

-   **Text Selection**: Allows users to select text directly from web pages.
-   **API Integration**: Sends the selected text to a backend API endpoint for further processing.
-   **User-Friendly Interface**: Simple installation and usage as a bookmarklet in browser.
-   **Text Selectione**: Users can highlight any text on a webpage.
-   **Prompt for Confirmation**: A dialog box appears, asking the user if they want to send the selected text.
-   **Trust Management**: Easily send selected text for verification within the TrustClip ecosystem.

## How It Works

-   **Highlight Text**: On any webpage, simply highlight the text you want to interact with.
-   **Click the Bookmarklet**: The bookmarklet will prompt you with a confirmation dialog showing the selected text.
-   **Send the Text**: Upon confirmation, the selected text will be sent to the backend for further processing or trust verification.

## Installation

To install and use the TrustClip Bookmarklet, follow these steps:
Use the Bookmarklet:
Highlight the desired text.
Click the bookmarklet to send the highlighted text for verification.

1. **Create a New Bookmark**:

    - Open your web browser and create a new bookmark.
    - Name it something like "Text Extractor".

2. **Add the Bookmarklet Code**:

    - Copy and paste the following code into the URL field of the bookmark:

    ```
    javascript: (function () {
        var script = document.createElement("script");
        script.src = "http://localhost:3000/bookmarklet.js";
        document.body.appendChild(script);
    })();
    ```
