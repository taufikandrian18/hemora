# HEMORA display font

Headings use **Saphion Light** (Lorenzo Martinez / Lurinzu Studios), the same display face as the KUBE Saint-Tropez site.

Saphion is a commercial font. Buy a licence that explicitly covers **web embedding**
(for example the Neo Saphion webfont licence on MyFonts, or ask the designer via Gumroad),
then add the file here as:

    public/assets/hemora/fonts/saphion-light.woff2

No code change is needed — `app/globals.css` already declares the `@font-face`.
Do not copy the font file from another website; that site's licence does not cover HEMORA.

Until the file exists, headings fall back to Josefin Sans Light (SIL Open Font License, via Google Fonts).
Body text uses Inter (SIL Open Font License), the same family KUBE uses.
