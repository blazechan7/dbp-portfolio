How the site's styling works (for editing the project)

• All pages use one main file: css/styles.css
  Don't change the order of the @import lines inside it, the order matters.

• Each page loads that file from html/home, html/about, etc.
  Example: ../../css/styles.css?v=40

• After you change any CSS, increase the number after ?v= on every page
  (e.g. v=40 → v=41). That forces browsers to load your new styles.

• Work page project pictures: put PNGs in images/work/
  Their names and layout are set in css/pages/work.css
