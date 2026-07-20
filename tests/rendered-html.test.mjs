import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function html(path = "/") {
  const response = await render(path);
  assert.equal(response.status, 200, `${path} should render`);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

function cssBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*{(?<block>[^}]*)}`, "s"));
  assert.ok(match?.groups?.block, `${selector} CSS block should exist`);
  return match.groups.block;
}

test("server-renders the HEMORA property selector with route links", async () => {
  const markup = await html("/");

  assert.match(markup, /<title>HEMORA — Lereng Senja Ciwidey &amp; Sriti Palu<\/title>/i);
  assert.match(markup, /class="selector-shell"/);
  assert.match(markup, /href="\/lereng"/);
  assert.match(markup, /href="\/sriti"/);
  assert.match(markup, /<source src="\/assets\/hemora\/hemora-hero\.mp4" type="video\/mp4"\/>/);
  assert.doesNotMatch(markup, /id="page-lereng"|id="page-sriti"|images\.unsplash\.com/);
});

test("uses the supplied HEMORA wordmark and favicon assets", async () => {
  const markup = await html("/");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const logo = await stat(new URL("../public/assets/hemora/hemora-logo.png", import.meta.url));
  const favicon = await stat(new URL("../public/favicon.png", import.meta.url));
  const faviconBytes = await readFile(new URL("../public/favicon.png", import.meta.url));
  const faviconHash = createHash("sha256").update(faviconBytes).digest("hex");

  assert.ok(logo.size > 1000);
  assert.ok(favicon.size > 1000);
  assert.equal(faviconHash, "cf0dce1d2c84a5faedd29df116ad9c6bf53e10a91367da3bf5b5836fefb94c82");
  assert.match(markup, /<img class="brand-logo" src="\/assets\/hemora\/hemora-logo\.png" alt="HEMORA"/);
  assert.match(layout, /icon: "\/favicon\.png"/);
  assert.match(layout, /shortcut: "\/favicon\.png"/);
});

test("renders Lereng and Sriti as separate property pages using the reference layout", async () => {
  const lereng = await html("/lereng");
  const sriti = await html("/sriti");

  for (const [slug, markup] of [
    ["lereng", lereng],
    ["sriti", sriti],
  ]) {
    assert.match(markup, new RegExp(`class="property-page property-page-${slug}"`));
    assert.match(markup, /class="property-nav"/);
    assert.match(markup, /<nav class="desktop-menu"/);
    assert.match(markup, /<details class="mobile-menu"/);
    assert.match(markup, /<summary aria-label="Open .* menu"/);
    assert.match(markup, /class="hamburger-lines"/);
    assert.match(markup, /<a(?=[^>]*href="\/")(?=[^>]*aria-label="Back to overview")(?=[^>]*class="back-link icon-only")[^>]*><svg/);
    assert.doesNotMatch(markup, />Overview<\/a>/);
    assert.match(markup, new RegExp(`<a(?=[^>]*href="/${slug}#book")(?=[^>]*class="nav-reserve")[^>]*>Reserve</a>`));
    assert.doesNotMatch(markup, /class="reserve-bar"/);
    assert.match(markup, /class="hero-stage"/);
    assert.match(markup, /class="fog-curtain left"/);
    assert.match(markup, /class="property-intro"/);
    assert.match(markup, /class="offers-carousel"/);
    assert.match(markup, /class="alternating-block"/);
    assert.match(markup, /class="quote-band"/);
    assert.match(markup, /class="booking-cta"/);
    assert.match(markup, /class="site-footer"/);
    assert.match(markup, /class="property-chat-widget active"/);
    assert.match(markup, /aria-label="Talk to HEMORA about [^"]+ on WhatsApp"/);
    assert.match(markup, /class="whatsapp-mark" aria-hidden="true" viewBox="0 0 24 24"/);
    assert.doesNotMatch(markup, /class="chat-orb"|>WhatsApp<\/span>|>WA<\/span>/);
    assert.match(markup, new RegExp(`href="/${slug}/stay"`));
    assert.match(markup, new RegExp(`href="/${slug}/dining"`));
    assert.match(markup, new RegExp(`href="/${slug}/wellness"`));
    assert.match(markup, new RegExp(`href="/${slug}/journal"`));
    assert.doesNotMatch(markup, /images\.unsplash\.com|Maison Aurèle|Aegean Coast/);
  }

  assert.match(lereng, /src="\/assets\/hemora\/lereng\/hero\.png"/);
  assert.match(lereng, /src="\/assets\/hemora\/lereng\/room\.png"/);
  assert.match(lereng, /src="\/assets\/hemora\/lereng\/dining\.png"/);
  assert.match(sriti, /src="\/assets\/hemora\/sriti\/hero\.png"/);
  assert.match(sriti, /src="\/assets\/hemora\/sriti\/room\.png"/);
  assert.match(sriti, /src="\/assets\/hemora\/sriti\/dining\.png"/);
});

test("renders every property menu page as its own route", async () => {
  for (const property of ["lereng", "sriti"]) {
    for (const section of ["stay", "dining", "wellness", "journal"]) {
      const markup = await html(`/${property}/${section}`);

      assert.match(markup, new RegExp(`class="menu-page property-page-${property}"`));
      assert.match(markup, /<nav class="desktop-menu"/);
      assert.match(markup, /<details class="mobile-menu"/);
      assert.match(markup, /<summary aria-label="Open .* menu"/);
      assert.match(markup, /<a(?=[^>]*href="\/")(?=[^>]*aria-label="Back to overview")(?=[^>]*class="back-link icon-only")[^>]*><svg/);
      assert.doesNotMatch(markup, />Overview<\/a>/);
      assert.match(markup, new RegExp(`<a(?=[^>]*href="/${property}#book")(?=[^>]*class="nav-reserve")[^>]*>Reserve</a>`));
      assert.match(markup, new RegExp(`href="/${property}"`));
      assert.match(markup, new RegExp(`href="/${property}/${section}" class="active"`));
      assert.match(markup, /class="menu-hero"/);
      assert.match(markup, /class="menu-detail-grid"/);
      assert.match(markup, /class="booking-cta"/);
      assert.match(markup, /class="property-chat-widget active"/);
      assert.doesNotMatch(markup, /images\.unsplash\.com|Lorem ipsum/i);
    }
  }
});

test("keeps the HEMORA brand palette and direct local assets", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const propertyCode = await readFile(new URL("../app/property-pages.tsx", import.meta.url), "utf8");

  assert.match(css, /--color-forest: #343f33;/);
  assert.match(css, /--color-ivory: #ece6da;/);
  assert.match(css, /--color-gold: #b49362;/);
  assert.doesNotMatch(css, /--cream|--creamDeep|--ink|--moss|--clay|#EFE9DD|#1C1917|#A8785A/i);
  assert.doesNotMatch(page + propertyCode, /from "next\/image"|<Image\b|images\.unsplash\.com/);

  const navBlock = cssBlock(css, ".property-nav");
  const desktopNavBlock = cssBlock(css, ".property-nav .desktop-menu");
  const chatBlock = cssBlock(css, ".property-chat-widget");
  const mobileMenuBlock = cssBlock(css, ".mobile-menu");
  const mobileMenuLinkBlock = cssBlock(css, ".property-nav .mobile-menu-panel a");

  assert.match(navBlock, /background:\s*transparent;/);
  assert.match(navBlock, /backdrop-filter:\s*none;/);
  assert.match(navBlock, /border-bottom:\s*0;/);
  assert.match(navBlock, /grid-template-columns:\s*auto auto minmax\(0,\s*1fr\) auto;/);
  assert.match(desktopNavBlock, /justify-content:\s*flex-end;/);
  assert.match(chatBlock, /border-radius:\s*999px;/);
  assert.match(chatBlock, /width:\s*3\.15rem;/);
  assert.match(mobileMenuBlock, /display:\s*none;/);
  assert.match(mobileMenuLinkBlock, /text-align:\s*center;/);
  assert.doesNotMatch(css, /\.property-nav nav\s*{/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.property-nav \.desktop-menu\s*{[\s\S]*display:\s*none;/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.mobile-menu\s*{[\s\S]*display:\s*block;/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.property-nav\s*{[\s\S]*grid-template-columns:\s*auto minmax\(0,\s*1fr\) auto auto;/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.property-nav \.mobile-menu-panel\s*{[\s\S]*left:\s*1rem;[\s\S]*right:\s*1rem;[\s\S]*width:\s*auto;/);
  assert.match(css, /@media \(max-width: 1080px\)[\s\S]*\.property-nav > \.desktop-menu\s*{/);
  assert.doesNotMatch(css, /class="chat-orb"|\.chat-orb|property-chat-widget span:not/);
  assert.doesNotMatch(css, /#25d366/i);
});
