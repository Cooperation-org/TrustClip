javascript:(function(){
  // Only run on LinkedIn
  if (!window.location.hostname.includes('linkedin.com')) {
    alert('This verification tool only works on LinkedIn pages');
    return;
  }
  
  // Extract member since from the page
  const pageText = document.body.innerText;
  const memberSinceMatch = pageText.match(/Member since ([A-Za-z]* )?(\d{4})/i);
  
  if (!memberSinceMatch) {
    alert('Could not find "Member since" on this page. Make sure you are on a LinkedIn profile page.');
    return;
  }
  
  const fullText = memberSinceMatch[0];
  const monthPart = memberSinceMatch[1] ? memberSinceMatch[1].trim() : '';
  const yearPart = memberSinceMatch[2];
  
  // Get verification token from sessionStorage (set by TalentStamp after OAuth)
  const verificationToken = sessionStorage.getItem('linkedin_verification_token');
  
  if (!verificationToken) {
    alert('Please complete LinkedIn verification on TalentStamp first');
    return;
  }
  
  // Extract profile ID from URL
  const pathParts = window.location.pathname.split('/');
  const profileId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
  
  // Confirm with user
  const confirmSend = confirm(`Found: "${fullText}"\n\nSend this verification to TalentStamp?`);
  
  if (!confirmSend) {
    return;
  }
  
  // Send to TalentStamp backend
  fetch('https://talent.linkedtrust.us/api/linkedin/verify-age', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Verification-Token': verificationToken
    },
    body: JSON.stringify({
      memberSince: fullText,
      year: parseInt(yearPart),
      month: monthPart,
      profileUrl: window.location.href,
      profileId: profileId,
      timestamp: new Date().toISOString()
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('✅ LinkedIn account age verified successfully!');
      // Clear the token after successful use
      sessionStorage.removeItem('linkedin_verification_token');
    } else {
      alert('Failed to verify: ' + (data.error || 'Unknown error'));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to send verification. Please try again.');
  });
})();
