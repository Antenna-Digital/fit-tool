# Archetype Assessment - Webflow Integration Guide

This is a vanilla HTML/JavaScript conversion of the React Archetype Assessment component, optimized for Webflow custom code integration.

## Files Overview

1. **archetype-assessment.html** - Complete standalone HTML file with all styles
2. **archetype-data.js** - Questions and archetype descriptions data
3. **archetype-logic.js** - Core calculation and utility functions
4. **archetype-app.js** - Main application logic and rendering

## How to Add to Webflow

### Option 1: Embed on a Single Page (Recommended)

1. **Create a new page** in Webflow or use an existing one
2. **Add an Embed element** to your page
3. **Copy the CSS** from `archetype-assessment.html` (everything between `<style>` tags)
4. **Paste into the Page Settings** → Custom Code → Head Code:
   ```html
   <style>
   /* Paste all CSS here */
   </style>
   ```

5. **Add the HTML container** in the Embed element:
   ```html
   <div id="app"></div>
   ```

6. **Add the JavaScript files** in Page Settings → Custom Code → Before </body> tag:
   ```html
   <script>
   // Paste contents of archetype-data.js here
   </script>
   
   <script>
   // Paste contents of archetype-logic.js here
   </script>
   
   <script>
   // Paste contents of archetype-app.js here
   </script>
   ```

### Option 2: Host JavaScript Files Externally

If you prefer to keep your custom code cleaner:

1. **Upload the three JS files** to a CDN or hosting service (e.g., AWS S3, Cloudflare, etc.)
2. **Add the CSS** to Page Settings → Head Code (as in Option 1)
3. **Add the container** via Embed element:
   ```html
   <div id="app"></div>
   ```
4. **Reference the external scripts** in Page Settings → Before </body> tag:
   ```html
   <script src="https://your-cdn.com/archetype-data.js"></script>
   <script src="https://your-cdn.com/archetype-logic.js"></script>
   <script src="https://your-cdn.com/archetype-app.js"></script>
   ```

### Option 3: Inline Everything (Quick Test)

For quick testing, you can use the complete `archetype-assessment.html` file:

1. **Add an Embed element** to your Webflow page
2. **Copy the entire contents** of `archetype-assessment.html`
3. **Paste into the Embed element**

## Customization

### Colors
The main brand color `#dde32f` (yellow-green) is used throughout. To change:
- Search for `#dde32f` in the CSS and replace with your color
- Search for `#E5E1DA` (background) and replace if needed

### Fonts
Currently uses Inter from Google Fonts. To change:
- Update the Google Fonts link in the HTML
- Update `font-family: 'Inter', sans-serif;` in the CSS

### Contact Form Submission
The contact form currently shows an alert. To integrate with Webflow forms or external service:

In `archetype-app.js`, find the `handleContactSubmit()` method and modify:

```javascript
handleContactSubmit() {
    if (this.contactData.name && this.contactData.organization && this.contactData.email) {
        // Replace this with your form submission logic
        // Example: Send to Webflow form, Zapier webhook, etc.
        
        fetch('YOUR_WEBHOOK_URL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.contactData)
        }).then(() => {
            alert('Thank you! We will be in touch soon.');
            this.showContactForm = false;
            this.render();
        });
    } else {
        alert('Please complete all fields.');
    }
}
```

## Testing Locally

To test the files locally:

1. Open `archetype-assessment.html` in a web browser
2. All functionality should work without a server

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported (uses ES6 features)

## Features

✅ Multi-step questionnaire with 10 questions
✅ Progress bar
✅ Dynamic scoring system
✅ Animated results visualization
✅ Quadrant chart with animated scores
✅ Contact form
✅ Responsive design
✅ Smooth hover effects
✅ No external dependencies (except Google Fonts)

## Support

For issues or questions about integration, refer to Webflow's custom code documentation:
https://university.webflow.com/lesson/custom-code-in-the-head-and-body-tags
