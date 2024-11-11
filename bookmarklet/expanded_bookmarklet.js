javascript:(function(){
    function getSelectedContent() {
        var selection = window.getSelection();
        var container = document.createElement('div');
        
        for (var i = 0; i < selection.rangeCount; i++) {
            var range = selection.getRangeAt(i);
            var fragment = range.cloneContents();
            container.appendChild(fragment);
        }
        
        // Convert links to text while preserving URLs
        var links = container.getElementsByTagName('a');
        for (var i = links.length - 1; i >= 0; i--) {
            var link = links[i];
            var text = link.textContent;
            var href = link.getAttribute('href');
            
            if (href && href !== text) {
                link.replaceWith(`${text} (${href})`);
            }
        }
        
        return container.innerText.trim().replace(/\s+/g, ' ');
    }

    document.addEventListener("mouseup", function() {
        var currentPageUrl = window.location.href;
        var selectedText = getSelectedContent();
        
        if (selectedText.length > 0) {
            var confirmSend = confirm(
                `Selected text: "${selectedText}". Do you want to send this text?`
            );
            
            if (confirmSend) {
                fetch("http://localhost:5000/process", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: selectedText,
                        source_url: currentPageUrl,  // Changed to match your backend
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    alert("Text sent successfully!");
                })
                .catch(error => {
                    console.log("Error:", error);
                    alert("Failed to send text.");
                });
            }
        }
    });
})();
