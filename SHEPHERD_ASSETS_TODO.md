# Shepherd Showcase - Assets Needed

## Images to Add to `/public` folder:

1. **shepherd-1.jpg** - First project image (e.g., cane handle with motor, person using cane, or CAD model)
2. **shepherd-2.jpg** - Second project image (different angle/aspect of the project)

## YouTube Video Configuration:

In `src/App.js`, replace `VIDEO_ID` with your actual YouTube video ID in two places:

```javascript
// Line ~565 (href)
href="https://www.youtube.com/watch?v=VIDEO_ID"

// Line ~571 (thumbnail)
src="https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg"
```

To find your YouTube video ID:
- If your video URL is `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- The video ID is: `dQw4w9WgXcQ`

## Fallback Behavior

If images/video are not found, the showcase will display placeholder text instead of broken images, so the site won't break.

## Image Recommendations

From your Devpost (https://devpost.com/software/raising-cane), good options include:
- Screenshot 5: Final handle version with motor bridge
- Screenshot 16: Omni-wheel and usage photo
- Screenshot 23: Team photo with Shepherd
- Any demo video thumbnail
