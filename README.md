# @linked-claims/trustclip

Bookmarklet tools for extracting claims from any web page and linking them into a decentralized web of trust. Extract attestations, claims, and trust signals from articles, social profiles, forums, or any web content.

## Core Purpose

TrustClip enables users to:
- **Extract claims** from any web content (articles, posts, profiles, documents)
- **Link claims** into a decentralized trust graph
- **Preserve context** by maintaining source URLs and metadata
- **Build trust networks** from existing web content

## Installation

```bash
npm install @linked-claims/trustclip
```

## Usage

### LinkedIn Age Verification

Specialized bookmarklet for verifying LinkedIn account age:

```typescript
import { LinkedInBookmarklet } from '@linked-claims/trustclip';

const linkedInBookmarklet = new LinkedInBookmarklet({
  apiEndpoint: 'https://your-api.com/linkedin/verify-age',
  tokenKey: 'linkedin_verification_token' // optional, defaults to this
});

// Get bookmarklet code
const code = linkedInBookmarklet.getBookmarkletCode();

// Get as data URI for links
const uri = linkedInBookmarklet.getBookmarkletURI();
```

### General Claim Extraction

The primary use case - extract claims from any web content:

```typescript
import { ClaimExtractionBookmarklet } from '@linked-claims/trustclip';

// Extract claims from news articles, blog posts, forum discussions, etc.
const claimBookmarklet = new ClaimExtractionBookmarklet({
  apiEndpoint: 'https://your-api.com/process',
  enableOnSelect: false // click to activate
});

// Auto-extract when text is selected (for power users)
const autoClaimBookmarklet = new ClaimExtractionBookmarklet({
  apiEndpoint: 'https://your-api.com/process',
  enableOnSelect: true
});
```

**Use cases:**
- Extract claims from news articles
- Capture attestations from blog posts
- Save endorsements from recommendation letters
- Collect statements from research papers
- Archive promises from company announcements

### Dynamic Script Loader

Load a more complex script from your server (useful for development):

```typescript
import { DynamicLoaderBookmarklet } from '@linked-claims/trustclip';

const loaderBookmarklet = new DynamicLoaderBookmarklet(
  'https://your-server.com' // will load from /bookmarklet.js
);
```

## Example: Creating Bookmarklet Links

```html
<!-- LinkedIn Age Verification -->
<a href="javascript:(function(){...})" 
   class="bookmarklet">
  🔍 Verify LinkedIn Age
</a>

<!-- Claim Extraction -->
<a href="javascript:(function(){...})" 
   class="bookmarklet">
  📋 Extract Claims
</a>
```

Or in React:

```tsx
function BookmarkletButtons() {
  const linkedIn = new LinkedInBookmarklet({ 
    apiEndpoint: '/api/linkedin/verify' 
  });
  
  const claims = new ClaimExtractionBookmarklet({ 
    apiEndpoint: '/api/claims/extract' 
  });
  
  return (
    <div>
      <a href={linkedIn.getBookmarkletURI()}>
        Verify LinkedIn
      </a>
      <a href={claims.getBookmarkletURI()}>
        Extract Claims
      </a>
    </div>
  );
}
```

## API Endpoints

Your API endpoints should accept:

### LinkedIn Verification
```typescript
POST /api/linkedin/verify-age
Headers: {
  'X-Verification-Token': 'token-from-session'
}
Body: {
  memberSince: string,    // "Member since March 2018"
  year: number,          // 2018
  month: string,         // "March"
  profileUrl: string,    // Full LinkedIn URL
  profileId: string,     // LinkedIn ID
  timestamp: string      // ISO timestamp
}
```

### Claim Extraction
```typescript
POST /api/claims/extract
Body: {
  text: string,          // Selected text
  source_url: string     // Current page URL
}
```

## Development

```bash
npm install
npm run build
```

## Local Testing with Talent App

1. **Build and link this package**:
   ```bash
   cd /Users/gv/parent/linked-trust/trustClip
   npm install
   npm run build
   npm link
   ```

2. **Link in the talent app** (when ready to test):
   ```bash
   cd /Users/gv/parent/linked-trust/talent
   npm link @linked-claims/trustclip
   ```

3. **To unlink later**:
   ```bash
   cd /Users/gv/parent/linked-trust/talent
   npm unlink @linked-claims/trustclip
   ```

Note: The talent app currently has its own embedded version of the bookmarklet code. This package structure is for future migration.
