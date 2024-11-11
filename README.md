# Bookmarklet

## Overview

**TrustClip Bookmarklet** allows users to quickly highlight and send selected text directly from a webpage. This tool is designed to enhance user interaction with trust management tools by making it simple to copy, verify, and interact with content in real-time.

The **Bookmarklet** project is a lightweight JavaScript utility designed to extract selected text from any webpage and send it to a backend API for processing.

It is particularly useful for applications that require quick data collection from online articles, such as claim processing or content analysis.

## Features

-   **Text Selection**: Allows users to select text directly from web pages.
-   **API Integration**: Sends the selected text to a backend API endpoint for further processing.
-   **User-Friendly Interface**: Simple installation and usage as a bookmarklet in browser.
-   **Text Selection**: Users can highlight any text on a webpage.
-   **Prompt for Confirmation**: A dialog box appears, asking the user if they want to send the selected text.
-   **Trust Management**: Easily send selected text for verification within the TrustClip ecosystem.

## How It Works

-   **Click the Bookmarklet**: After clicking the bookmarklet, highlighted text in that window will be sent for claims.
-   **Highlight Text**: On any webpage, simply highlight the text you want to interact with.  A confirmation dialog will pop up.
-   **Send the Text**: Upon confirmation, the selected text will be sent to the backend for further processing or trust verification.

## Installation

To install and use the TrustClip Bookmarklet, follow these steps:

1. **Install TrustClip**:

    - Open the [index.html](./index.html) page in this repo directly in a browser (not from github).
    - Drag the button to your bookmarks bar.

2. **Alternate manual installation**:

    - create a bookmark with this code, where the src link is where the bookmarklet is installed 

    ```
    javascript: (function () {
        var script = document.createElement("script");
        script.src = "http://localhost:3000/bookmarklet.js";
        document.body.appendChild(script);
    })();
    ```
