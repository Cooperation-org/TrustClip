javascript: (function () {
    // Listen for the 'mouseup' event to detect when the user finishes selecting text
    document.addEventListener("mouseup", function () {
        var selectedText = window.getSelection().toString().trim();

        // Check if any text was selected
        if (selectedText.length > 0) {
            // Confirm if the user wants to send the selected text
            var confirmSend = confirm(
                `Selected text: "${selectedText}". Do you want to send this text?`
            );

            if (confirmSend) {
                var backendUrl = "http://localhost:3000/claimRoute"; // Your API endpoint
                var data = {
                    text: selectedText,
                };

                // Send the selected text to the backend using fetch
                fetch(backendUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        alert("Text sent successfully!");
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        alert("Failed to send text.");
                    });
            }
        }
    });
})();
