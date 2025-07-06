export interface BookmarkletOptions {
  apiEndpoint: string;
  tokenKey?: string;
}

export class LinkedInBookmarklet {
  private apiEndpoint: string;
  private tokenKey: string;

  constructor(options: BookmarkletOptions) {
    this.apiEndpoint = options.apiEndpoint;
    this.tokenKey = options.tokenKey || 'linkedin_verification_token';
  }

  getBookmarkletCode(minified = true): string {
    const code = `(function(){
  // Only run on LinkedIn
  if (!window.location.hostname.includes('linkedin.com')) {
    alert('This verification tool only works on LinkedIn pages');
    return;
  }
  
  // Extract member since from the page
  const pageText = document.body.innerText;
  const memberSinceMatch = pageText.match(/Member since ([A-Za-z]* )?(\\d{4})/i);
  
  if (!memberSinceMatch) {
    alert('Could not find "Member since" on this page. Make sure you are on a LinkedIn profile page.');
    return;
  }
  
  const fullText = memberSinceMatch[0];
  const monthPart = memberSinceMatch[1] ? memberSinceMatch[1].trim() : '';
  const yearPart = memberSinceMatch[2];
  
  // Get verification token from sessionStorage
  const verificationToken = sessionStorage.getItem('${this.tokenKey}');
  
  if (!verificationToken) {
    alert('Please complete LinkedIn verification on TalentStamp first');
    return;
  }
  
  // Extract profile ID from URL
  const pathParts = window.location.pathname.split('/');
  const profileId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
  
  // Confirm with user
  const confirmSend = confirm('Found: "' + fullText + '"\\n\\nSend this verification to TalentStamp?');
  
  if (!confirmSend) {
    return;
  }
  
  // Send to backend
  fetch('${this.apiEndpoint}', {
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
      sessionStorage.removeItem('${this.tokenKey}');
    } else {
      alert('Failed to verify: ' + (data.error || 'Unknown error'));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to send verification. Please try again.');
  });
})();`;

    if (minified) {
      return code
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}();,:])\s*/g, '$1') // Remove space around symbols
        .trim();
    }
    return code;
  }

  getBookmarkletURI(): string {
    return `javascript:${this.getBookmarkletCode(true)}`;
  }
}
