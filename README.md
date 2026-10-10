# Amelia & Zivan — Wedding Invitation Site

Static site (HTML, CSS, JS). No build step; works on GitHub Pages as is.

## Find and fill the placeholders
Search the project for `TBC`. Items still to add:
- Ceremony and reception times (index.html, "The Day")
- Addresses (index.html)
- Itinerary times (index.html, "Itinerary")
- Dress code wording (index.html, "Dress Code")
- Hotel name/details (index.html, "Stay")
- RSVP deadline (index.html, "Kindly Reply")
- Bible verse / quote (index.html, "Welcome")
- FAQ answers (index.html, "Good to Know")

## Settings (top of js/script.js, CONFIG)
- `hotelBookingUrl`: paste the hotel booking link; the button activates automatically
- `venueMapUrl`: exact Google Maps link for Pont de Val
- `rsvpEmail`: where RSVPs are sent
- `weddingDate`: change the time once the ceremony start time is known

## RSVP emails (one-time activation)
RSVPs are sent with FormSubmit.co. After the site is live, submit one test RSVP;
FormSubmit emails epiclogossa2@gmail.com an "Activate form" message. Click the
link in it once, and every later RSVP will arrive in that inbox. Check spam too.

## Personalised invites
`https://USERNAME.github.io/REPO/?guest=The-Naidoo-Family` greets "Dear The Naidoo Family,"
and the name is included in the RSVP email.

## Publish on GitHub Pages
Upload everything to the repo root, then Settings > Pages > Deploy from a branch > main / (root).
