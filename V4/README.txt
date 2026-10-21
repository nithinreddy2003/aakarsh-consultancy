Aakarsh Consultancy Enterprises Limited - website (V4)
======================================================

Static HTML, CSS and JavaScript. No build step.
Open index.html, or run:  python -m http.server 8000

Built from the Furni template as a design REFERENCE
---------------------------------------------------
The template supplied in "../Template To use" is Furni by Untree.co
(Bootstrap 5, licensed CC BY 3.0). You asked to take it as a reference while
keeping our own originality and using our logo as is. So:

  Taken as reference (visual language only)
    - solid brand-colour hero with a side panel and a dotted motif
    - pill buttons, 20px soft cards, 10px icon tiles
    - the two-column ring-bullet list
    - Inter typeface, generous section padding
    - navbar with an underline that grows on hover

  NOT used
    - no Furni CSS or SCSS. css/style.css is written from scratch for this site
    - no Furni markup. Every page here is our own structure and copy
    - no Furni images. The furniture photos, product shots, stock portraits,
      dots SVGs and icon SVGs are all left behind. The dotted motif is
      recreated with a CSS radial-gradient, and the icons are inline SVG
      authored for this site
    - no e-commerce pages (shop, cart, checkout, blog, thank-you)

  Because none of Untree.co's code or assets ship here, the CC BY 3.0
  attribution requirement does not attach to this build. If you ever paste in
  Furni's style.css, markup or images, you must credit Untree.co.

Third-party code that IS included
  css/bootstrap.min.css      Bootstrap 5.1.3, MIT licence (header comment kept)
  js/bootstrap.bundle.min.js Bootstrap 5.1.3, MIT licence
  Inter                      loaded from Google Fonts, SIL Open Font Licence

Brand
-----
images/logo.png is your logo used AS IS - a byte-identical copy of
"Aakarsh Consultancy Logo.png". Not recoloured, redrawn, cropped or resized.
It is scaled in CSS only (54px in the navbar, 56px in the footer).

The logo has a solid white background rather than transparency, so the navbar
is white and lets it sit flush. That avoids touching the artwork. If you get a
transparent PNG or an SVG, drop it in as images/logo.png.

Colours sampled from the logo artwork:
  --brand    #096BB3   logo blue: hero, buttons, icons, links
  --accent   #E30C17   logo red: primary call to action, nav underline, flags
  --ink      #2F2F2F   headings
  --body     #5F6A72   body copy
  --paper    #F1F4F7   page background

Pages
-----
index, about, services, recruitment, executive-search, staffing, rpo,
skill-development, industries, clients, careers, contact.

css/style.css   all custom styling, grouped and commented
js/site.js      footer year and the contact form handoff
                (the mobile menu is Bootstrap's collapse component)

Images
------
Supplied images, placed by what they actually show
--------------------------------------------------
Six of the seven files from "../Images for website" are in use. Each was
resized and re-compressed for the web; the originals are untouched in that
folder.

  interview-panel.jpg     from Hiring.jpg
                          a candidate facing a three-person panel.
                          home page, beside "Three reasons clients stay with us"
                          6000x4000, 1.9 MB  ->  1600x1067, 145 KB

  candidates-waiting.jpg  from Hiring 2.jpg
                          five candidates seated with their papers.
                          careers page, beside "We treat your profile as more
                          than a CV"
                          6016x4016, 2.9 MB  ->  1600x1068, 271 KB

  resume-screening.jpg    from Resume Screening.jpg
                          a CV checked under a magnifier, requirements ticked.
                          home page, beside "You see the shortlist, not the pile"
                          2121x1414, 77 KB  ->  1400x933, 69 KB

  industry-it.jpg         from IT.png
                          a developer amid technology stacks.
                          industries page, Information Technology panel
                          1536x1024, 1.4 MB  ->  1200x800, 140 KB

  industry-non-it.jpg     from Non -IT.png
                          a business professional coordinating functions.
                          industries page, Core & non-IT panel
                          1536x1024, 1.4 MB  ->  1200x800, 129 KB

  images/steps/           from the eight portrait step PNGs
                          step-1-share-the-jd.jpg ... step-8-invoice-on-joining.jpg
                          each already carries its number and heading.
                          recruitment page, the auto-scrolling carousel
                          941x1672 PNG, 1.3 MB each (10.3 MB total)
                          ->  560x995 JPEG q88, 568 KB for all eight

  hiring-steps.jpg        from the earlier combined Hiring steps.png
                          NO LONGER REFERENCED. The carousel replaced this
                          static strip, since showing the same eight steps
                          three times on one page (strip, carousel, cards) was
                          one too many. Kept on disk if you want it back.
                          the eight steps labelled in order, matching our
                          process exactly.
                          recruitment page, banner above the eight step cards
                          2172x724 PNG, 1.3 MB  ->  1800x600 JPEG, 154 KB
                          (kept as JPEG q90, not PNG: the text stays crisp and
                          it drops from 1.1 MB to 154 KB)

Not used: Quote.jpg
  "We rise by lifting others" in cut-out magazine letters on peach. Left out
  for three reasons: the wording is a different quote from the one in our own
  pull-quote block, so the two would compete; text baked into an image cannot
  reflow, be translated or be read by a screen reader; and the peach and pink
  clash with the logo's blue and red. If you want it, the natural home is the
  about page beside "Vision, mission and values" - say the word.

Please confirm you hold the rights to these six. Two look like stock
photography and three like generated illustrations; if any came from a stock
library, check the licence covers commercial use on your site. Also note
industry-it.jpg shows third-party logos (Python, Java, React and others),
which is normal for illustrating skills recruited for, but is worth knowing.

Original illustrations
----------------------
The remaining illustrations in images/ are original SVG, drawn for this site in
the logo colours. They are vector, so they stay sharp at any size:

  art-hero.svg       home hero, a consultant handing over the shortlist
  art-team.svg       about page, consultants reviewing mandates
  art-office.svg     contact page, the Somajiguda office

Six are now spare, having been replaced by your images. They are kept as
drop-in alternates, and cost nothing sitting there (15 KB in total):
  art-screening.svg  was home, "You see the shortlist, not the pile"
  art-why.svg        was home, beside "Three reasons clients stay with us"
  art-careers.svg    was the careers page
  art-grid-1.svg     was the home photo stack, an interview in progress
  art-grid-2.svg     was the home photo stack, campus hiring
  art-grid-3.svg     was the home photo stack, a candidate joining

Photo stack images
------------------
The three cards in "Our commitments" use your photographs, resized to 900x900
and saved as JPEG (97-113 KB each, down from 2 MB apiece as PNG). The source
files are in "Images for website" one level up:

  commit-sourcing.jpg    card 1, top left.      index 1 (3).png
                         A consultant reading CVs before shortlisting.
  commit-campus.jpg      card 2, top right.     index 1 (1).png
                         Recruiters and graduates at a campus hiring fair.
  commit-placement.jpg   card 3, bottom centre. index 1 (2).png
                         A handshake across the interview table.

All three are square, which suits cards 2 and 3 exactly. Card 1 is 4:5, so
cover crops about a tenth off each side; the subject sits clear of that. To
swap any of them, drop a new file in at the same name, or change the src and
set --c1-pos / --c2-pos / --c3-pos if a crop cuts a face.

Image placement follows the template
------------------------------------
The home page now puts images where Furni puts them:
  - a large image in the hero, beside the headline
  - a feature image in the mid-page "how it works" band
  - a tall image beside the "why choose us" feature grid
  - the three-image cluster further down, redrawn as an overlapping stack

What the template put in those slots was furniture: couch.png and sofa.png in
the hero and footer, product-1/2/3.png as priced product cards,
why-choose-us-img.jpg as a living room, img-grid-1/2/3.jpg as showroom
interiors, person_1..4.jpg as stock studio portraits, post-1/2/3.jpg as blog
thumbnails. None of it depicts recruitment, and the portraits would have meant
passing stock faces off as your consultants, so all of it was left behind.

Adding your own photography
---------------------------
Real photographs would lift the site further, and they have to come from you:
we have no licensed pictures of your office, your team or Mr. Venkat. The
template's bundled portraits were deliberately not used, since presenting
stock faces as your people would be misleading.

The CSS is already set up for it. Wrap any photo in a .media--photo box and
the aspect ratio is fixed for you, so dropping a file in never shifts the
layout:

  <div class="media--photo">                 <!-- 4:3  -->
    <img src="images/office.jpg" alt="...">
  </div>
  <div class="media--photo media--wide">     <!-- 16:9 -->
  <div class="media--photo media--portrait"> <!-- 1:1, max 320px -->

There is also .media-caption for a credit line under a figure.

The "Our commitments" band on the home page uses .photo-stack: three
.media--photo cards layered into one overlapping composition. Size, overlap
and animation are all custom properties set on .photo-stack in style.css, in
the block marked "overlapping photo stack" - edit those and nothing else:

  --stack-max      overall width cap, shrink it to make every card smaller
  --stack-ratio    box proportions, e.g. 1 / 1.1 for a taller cluster
  --c1-w / --c1-x / --c1-y     card 1 width and position, in per cent
  --c2-w / --c2-x / --c2-y     card 2, lower --c2-x for more overlap
  --c3-w / --c3-x / --c3-b     card 3, raise --c3-b to lift it off the floor
  --stack-dur      reveal speed, --stack-stagger the gap between the three
  --stack-lift / --stack-zoom  the hover lift and scale

The three cards hold real photographs, listed under "Photo stack images"
above. To swap one, change its src; use --c1-pos, --c2-pos or --c3-pos
(object-position) if a crop cuts a face.

Worth shooting, in priority order:
  1. images/venkat.jpg    portrait of Mr. Venkat, square, 640x640 or larger.
                          about.html has a ready-to-paste block in a comment
                          marked PHOTO SLOT.
  2. images/office.jpg    the Somajiguda office, interior or entrance, 4:3,
                          1600x1200 or larger. Suits contact.html, replacing
                          art-office.svg.
  3. images/team.jpg      consultants at work, 4:3. Suits about.html.
  4. images/campus.jpg    a campus hiring or interview session, 4:3.
                          Suits careers.html or skill-development.html.

Export photos as JPEG at roughly 1600px on the long edge, quality 80, which
usually lands between 150 and 300 KB. Keep the illustrations for any slot you
have no photograph for; mixing the two is fine.

To confirm / complete before going live
---------------------------------------
1. Office address: the old site said 6-3-1090/C/4, above Andhra Bank, Raj Bhavan
   Road; the 2026 corporate profile says 6-3-1090/C/C, above Union Bank of India.
   contact.html uses the profile version. See the comment in that file.
2. Client logos / names for clients.html (TODO comment in the file).
3. The contact form opens the visitor's email app (mailto:). Replace with a
   backend endpoint when one is available; the hook is in js/site.js.
4. Landline 040-42028029/30/31 and the ISO certification were left out because
   the 2026 profile does not mention them. Add back if still valid
   (ISO 9001:2008 is expired).
5. images/logo.png is 1 MB because it is the untouched master, and it loads on
   every page. Once the design is signed off, export a web-sized copy
   (about 600x200) to cut roughly 1 MB per page view.
6. Consider self-hosting Inter to remove the Google Fonts request.

Other folders in this workspace
-------------------------------
../Template To use/   the supplied Furni template, untouched
../V1/                earlier bold-typography build, now carrying the logo
../V2/                earlier minimal build
../Backups/           V1 as it stood before the logo and palette work

Recruitment process carousel (recruitment.html only)
----------------------------------------------------
The eight step cards scroll continuously from right to left above the existing
step detail cards. Nothing else on the site was touched.

  markup   recruitment.html, the .steps-carousel block
  styles   css/style.css, section 10d
  script   js/site.js, the second IIFE

How the seamless loop works
  The viewport is a native horizontal scroll container, so touch, trackpad and
  shift+wheel gestures all work without any extra code, and the arrows are
  plain scrollBy calls. At runtime the script clones the eight slides once, so
  the track holds the sequence twice. The auto-scroll advances scrollLeft a
  little each animation frame; as soon as it passes the start of the duplicate
  set it subtracts that exact distance. Because the content at both positions
  is identical, the reset is invisible and the loop never stalls on the last
  card or snaps back to the first.

  One trap worth recording: the loop distance is NOT scrollWidth / 2. The track
  is 16 slides with 15 gaps between them, so half of it falls half a gap short
  of slide 9 - which showed up as a 10px backward jolt on every cycle at
  desktop width, 8px on tablet. The distance is measured off the layout
  instead, as slide[8].offsetLeft - slide[0].offsetLeft.

Behaviour
  - pauses on hover, on keyboard focus, and while a finger is down, resuming
    1.5s after the touch ends
  - stops while the browser tab is hidden
  - arrows move one card; "previous" from the very start first hops into the
    duplicate set so it loops backwards too
  - honours prefers-reduced-motion: no auto-scroll at all, and the arrows jump
    instead of gliding. The carousel stays manually scrollable
  - the viewport is focusable and arrow-key scrollable for keyboard users
  - clones carry aria-hidden and empty alt, so screen readers and the tab order
    only ever meet the eight real slides

Sizing
  Card width comes from the --step-w custom property on .steps-carousel, which
  steps down 250 / 228 / 210 / 188 / 162px across the breakpoints. That gives
  about 4.1 cards visible on desktop, 3.1 on tablet and 2.9 on a phone. The
  image box is locked to the artwork's 560:995 ratio with object-fit: contain,
  so nothing is cropped, nothing letterboxes, and the reserved height means no
  layout shift as the images arrive.

  The edge fades use --paper, matching the section behind them. If this block is
  ever moved onto a white section, update those two gradients to match.

To change the speed, edit PX_PER_SECOND in js/site.js (currently 40).
