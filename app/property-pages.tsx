/* eslint-disable @next/next/no-img-element -- Vinext dev does not provide ASSETS for local image optimization. */
import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import { bookingBaseUrl, getSiblingProperty, menuSections, properties, propertySlugs, type MenuSlug, type PropertyData, type PropertySection } from "./property-data";
import { BookingForm, LocalTime, SliderControls } from "./motion";

type HemoraIconName = "arrow-left" | "arrow-right" | "ballroom" | "bar" | "close" | "dining" | "hotel-simple" | "leaf" | "menu" | "phone" | "spa" | "sunrise";

const heroStatIcons: HemoraIconName[] = ["bar", "dining", "spa", "ballroom"];

function HemoraIcon({ name, className }: { name: HemoraIconName; className?: string }) {
  return <span className={["hemora-icon", `hemora-icon-${name}`, className].filter(Boolean).join(" ")} aria-hidden="true" />;
}

function ArrowIcon() {
  return <HemoraIcon name="arrow-right" />;
}

function BackIcon() {
  return <HemoraIcon name="arrow-left" />;
}

function WhatsAppIcon() {
  return <HemoraIcon name="phone" className="chat-mark" />;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function cssVars(vars: Record<string, string | number>) {
  return vars as CSSProperties;
}

/** Splits a line into word spans so CSS can stagger each word's entrance. */
function Words({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="word" style={cssVars({ "--i": index + offset })}>
            <span>{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** Heading whose words brighten one by one as it scrolls through the viewport. */
function ScrollWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");

  return (
    <h2 className={["scroll-words", className].filter(Boolean).join(" ")} data-scroll-words style={cssVars({ "--n": words.length })}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} style={cssVars({ "--i": index })}>
          {word}
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </h2>
  );
}

function StatLabel({ label }: { label: string }) {
  const [firstWord, ...rest] = label.split(" ");

  return (
    <span>
      {firstWord}
      {rest.length > 0 ? (
        <>
          <br />
          {rest.join(" ")}
        </>
      ) : null}
    </span>
  );
}

function IconStats({ property, className, itemClassName }: { property: PropertyData; className: string; itemClassName: string }) {
  return (
    <div className={className} aria-label="Property highlights">
      {property.stats.map((stat, index) => (
        <div className={`${itemClassName} icon-stat`} key={`${stat.value}-${stat.label}`}>
          <div className="stat-value-row">
            <HemoraIcon name={heroStatIcons[index] ?? "bar"} className="hero-stat-icon" />
            <strong>{stat.value}</strong>
          </div>
          <StatLabel label={stat.label} />
        </div>
      ))}
    </div>
  );
}

function BrandLockup({ compact = false, href = "/" }: { compact?: boolean; href?: string }) {
  return (
    <Link className={compact ? "brand-lockup compact" : "brand-lockup"} href={href}>
      <img className="brand-logo" src="/assets/hemora/hemora-logo.png" alt="HEMORA" width={920} height={167} />
    </Link>
  );
}

function PropertyNav({ property, active }: { property: PropertyData; active?: MenuSlug }) {
  const sibling = getSiblingProperty(property);

  return (
    <header className="property-nav">
      <div className="nav-left">
        <details className="site-menu">
          <summary aria-label={`Open ${property.shortTitle} menu`}>
            <HemoraIcon name="menu" className="menu-mark" />
            <HemoraIcon name="close" className="close-mark" />
            <span className="menu-label">Menu</span>
          </summary>
          <div className="site-menu-panel">
            <div className="site-menu-previews" aria-hidden="true">
              <img src={property.heroImage} alt="" />
              {menuSections.map((item) => (
                <img key={item.slug} className={`preview-${item.slug}`} src={property.sections[item.slug].image} alt="" />
              ))}
            </div>
            <nav className="site-menu-links" aria-label={`${property.shortTitle} menu`}>
              <p className="eyebrow">{property.title}</p>
              {menuSections.map((item, index) => (
                <Link key={item.slug} href={`/${property.slug}/${item.slug}`} className={item.slug === active ? `menu-link-${item.slug} active` : `menu-link-${item.slug}`}>
                  <small>{pad(index + 1)}</small>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="site-menu-aside">
              <div>
                <p className="eyebrow">Contact</p>
                <p>{property.address}</p>
                <a href={`mailto:${property.email}`}>{property.email}</a>
                <a href={`tel:${property.phone.replaceAll(" ", "")}`}>{property.phone}</a>
              </div>
              <Link className="menu-sibling" href={`/${sibling.slug}`}>
                <span className="eyebrow">Also by HEMORA</span>
                <strong>{sibling.shortTitle}</strong>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </details>
        <Link href="/" aria-label="Back to overview" className="back-link icon-only">
          <BackIcon />
        </Link>
      </div>
      <BrandLockup compact href={`/${property.slug}`} />
      <Link className="nav-reserve" href={`/${property.slug}#book`}>
        Reserve
      </Link>
    </header>
  );
}

function WhatsAppWidget({ property }: { property: PropertyData }) {
  return (
    <a className="property-chat-widget active" href="https://wa.me/6281234567890" aria-label={`Talk to HEMORA about ${property.shortTitle} on WhatsApp`}>
      <WhatsAppIcon />
    </a>
  );
}

function BookingCta({ property }: { property: PropertyData }) {
  return (
    <section id="book" className="booking-cta">
      <div className="booking-media" data-reveal="clip">
        <img src={property.bookingImage} alt={property.bookingAlt} />
      </div>
      <div className="booking-content" data-reveal>
        <p className="eyebrow">§ 07 — Reserve</p>
        <h2>{property.bookingTitle}</h2>
        <p>{property.bookingLead}</p>
        <BookingForm action={bookingBaseUrl} propertyId={property.bookingPropertyId} />
      </div>
    </section>
  );
}

/** HEMORA wordmark set in the display face, with the brand mark standing in for the "O". */
function Wordmark({ className }: { className?: string }) {
  return (
    <span className={["type-wordmark", className].filter(Boolean).join(" ")} aria-hidden="true">
      <span>H</span>
      <span>E</span>
      <span>M</span>
      <i className="type-wordmark-mark" />
      <span>R</span>
      <span>A</span>
    </span>
  );
}

function Footer({ property }: { property: PropertyData }) {
  return (
    <footer className="site-footer">
      <div className="grain-layer" />
      <div className="footer-cta" data-reveal>
        <p className="eyebrow">{property.title}</p>
        <h2 className="footer-headline">
          Stay a little <em>longer.</em>
        </h2>
        <a className="pill-cta" href="#book">
          <span>Plan your stay</span>
          <span className="pill-cta-badge">
            <ArrowIcon />
          </span>
        </a>
      </div>
      <div className="footer-grid">
        <div className="footer-col">
          <p className="eyebrow">Visit</p>
          <p>{property.address}</p>
          <LocalTime timeZone={property.timeZone} label={`${property.timeZoneLabel} · local time`} />
        </div>
        <div className="footer-col">
          <p className="eyebrow">Talk to us</p>
          <a href={`mailto:${property.email}`}>{property.email}</a>
          <a href={`tel:${property.phone.replaceAll(" ", "")}`}>{property.phone}</a>
          <a href="https://wa.me/6281234567890">WhatsApp concierge</a>
        </div>
        <nav className="footer-col" aria-label={`${property.shortTitle} footer`}>
          <p className="eyebrow">Explore</p>
          <Link href={`/${property.slug}/stay`}>Stay</Link>
          <Link href={`/${property.slug}/dining`}>Dining</Link>
          <Link href={`/${property.slug}/wellness`}>Wellness</Link>
          <Link href={`/${property.slug}/journal`}>Journal</Link>
        </nav>
        <div className="footer-col footer-collection">
          <p className="eyebrow">The collection</p>
          {propertySlugs.map((slug) => {
            const item = properties[slug];
            const current = slug === property.slug;
            return (
              <Link key={slug} href={`/${slug}`} className={current ? "collection-link current" : "collection-link"} aria-current={current ? "page" : undefined}>
                <span>
                  <strong>{item.shortTitle}</strong>
                  <small>{item.location}</small>
                </span>
                <ArrowIcon />
              </Link>
            );
          })}
        </div>
      </div>
      <Link className="footer-wordmark" href={`/${property.slug}`} aria-label={`${property.shortTitle} home`}>
        <Wordmark />
      </Link>
      <div className="footer-bottom">
        <p>© 2026 HEMORA · A Mora Group hospitality brand</p>
        <a href="#top" className="back-to-top">
          Back to top
          <HemoraIcon name="arrow-right" className="back-to-top-icon" />
        </a>
      </div>
    </footer>
  );
}

/** Oversized property name; each letter rises in sequence. */
function HeroWordmark({ lines }: { lines: string[] }) {
  let index = 0;

  return (
    <h1 className="hero-wordmark">
      {lines.map((line) => (
        <span className="hero-wordmark-line" key={line}>
          {Array.from(line).map((letter, position) => (
            <span className="letter" key={`${letter}-${position}`} style={cssVars({ "--i": index++ })}>
              {letter}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

function PropertyHero({ property }: { property: PropertyData }) {
  const order = propertySlugs.indexOf(property.slug) + 1;

  return (
    <section className={`hero-stage hero-${property.slug}`} id="top">
      <div className="hero-frame">
        <video className="hero-media" autoPlay muted loop playsInline preload="metadata" poster={property.heroPoster} aria-label={property.heroAlt}>
          <source src={property.heroVideo} type="video/mp4" />
        </video>
        <div className="hero-tint" />
        <div className="grain-layer" />
        <div className="hero-meta">
          <span>
            {pad(order)} / {pad(propertySlugs.length)} — {property.location}
          </span>
          <span className="hero-coordinates">{property.coordinates}</span>
          <LocalTime timeZone={property.timeZone} label={property.timeZoneLabel} />
        </div>
        <div className="hero-aside">
          <p className="property-name">{property.tone}</p>
          <p className="hero-tagline words-rise">
            <Words text={property.heroTitle} />{" "}
            <em>
              <Words text={property.heroEmphasis} offset={property.heroTitle.split(" ").length} />
            </em>
          </p>
          <p className="hero-intro">{property.intro}</p>
          <a className="pill-cta" href="#book">
            <span>{property.primaryAction}</span>
            <span className="pill-cta-badge">
              <ArrowIcon />
            </span>
          </a>
        </div>
        <HeroWordmark lines={property.wordmark} />
      </div>
    </section>
  );
}

function Intro({ property }: { property: PropertyData }) {
  return (
    <section className="property-intro">
      <div className="intro-head">
        <p className="eyebrow">{property.philosophyLabel}</p>
        <p className="eyebrow">{property.location}</p>
      </div>
      <ScrollWords text={property.philosophyTitle} />
      <div className="intro-grid">
        <figure className="intro-figure intro-figure-tall" data-reveal="clip">
          <img src={property.sections.stay.image} alt={property.sections.stay.alt} />
        </figure>
        <div className="intro-copy" data-reveal>
          <p className="lead-copy">{property.philosophyLead}</p>
          <p>{property.philosophyBody}</p>
          <IconStats property={property} className="intro-stats" itemClassName="intro-stat" />
        </div>
        <figure className="intro-figure intro-figure-small" data-reveal="clip">
          <img src={property.sections.dining.image} alt={property.sections.dining.alt} />
          <figcaption>{property.sections.dining.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Offers({ property }: { property: PropertyData }) {
  const trackId = `offers-${property.slug}`;

  return (
    <section className="offers-section">
      <div className="section-heading-row" data-reveal>
        <div>
          <p className="eyebrow">§ 02 — Current Offerings</p>
          <h2>{property.offersTitle}</h2>
        </div>
        <div className="section-heading-aside">
          <p>{property.offersIntro}</p>
          <SliderControls targetId={trackId} count={property.offers.length} />
        </div>
      </div>
      <div className="offers-carousel" id={trackId} aria-label={`${property.shortTitle} offers`}>
        {property.offers.map((offer, index) => (
          <article className="offer-card" key={offer.name} data-reveal style={cssVars({ "--delay": `${index * 90}ms` })}>
            <div className="offer-media">
              <img src={offer.image} alt={offer.alt} />
              <span className="offer-index">{pad(index + 1)}</span>
            </div>
            <div className="offer-body">
              <span>{offer.meta}</span>
              <h3>{offer.name}</h3>
              <p>{offer.description}</p>
              <div className="offer-foot">
                <strong>{offer.rate}</strong>
                <a className="link-arrow" href="#book">
                  Enquire
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Chapter({ section, index, property }: { section: PropertySection; index: number; property: PropertyData }) {
  return (
    <section id={section.slug} className={index % 2 ? "chapter-panel reverse" : "chapter-panel"}>
      <div className="chapter-media">
        <img src={section.image} alt={section.alt} />
        <div className="chapter-shade" />
        <p className="chapter-label" aria-hidden="true">
          {section.label}
        </p>
      </div>
      <div className="chapter-card" data-reveal>
        <div className="chapter-card-head">
          <span className="chapter-index">{pad(index + 1)}</span>
          <p className="eyebrow">{section.eyebrow}</p>
        </div>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
        {section.secondary ? <p>{section.secondary}</p> : null}
        <div className="chapter-meta">
          <span>{section.caption}</span>
          <span>{section.meta}</span>
        </div>
        <Link className="link-arrow" href={`/${property.slug}/${section.slug}`}>
          Discover {section.label}
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

function QuoteBand({ property }: { property: PropertyData }) {
  return (
    <section className="quote-band">
      <div className="marquee-strip" aria-hidden="true">
        <div>
          {[...property.marquee, ...property.marquee].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
      <div className="quote-body" data-reveal>
        <p className="eyebrow">§ 06 — In Other Words</p>
        <blockquote>{property.quote}</blockquote>
        <span>{property.quoteSource}</span>
      </div>
    </section>
  );
}

export function HomeSelector() {
  const panels = [properties.lereng, properties.sriti];

  return (
    <main className="selector-shell">
      <header className="selector-topbar home-topbar">
        <p className="eyebrow">Two Sanctuaries · One Standard of Stillness</p>
        <BrandLockup />
        <nav className="selector-dots" aria-label="Property selector">
          <Link className="dot active" href="/" aria-label="Overview" />
          <Link className="dot" href="/lereng" aria-label="Lereng Senja" />
          <Link className="dot" href="/sriti" aria-label="Sriti Palu" />
        </nav>
      </header>
      <div className="split-panels" aria-label="Choose a HEMORA property">
        {panels.map((property, index) => (
          <Link key={property.slug} className={`split-panel split-panel-${property.slug}`} href={`/${property.slug}`}>
            <video className="split-video" autoPlay muted loop playsInline preload="metadata" poster={property.heroPoster} aria-hidden="true">
              <source src={property.heroVideo} type="video/mp4" />
            </video>
            <span className="split-shade" />
            <span className="split-index">
              {pad(index + 1)} — {property.location}
            </span>
            <span className="split-body">
              <HemoraIcon name="hotel-simple" className="selector-property-icon" />
              <span className="split-tone">{property.tone}</span>
              <strong className="split-title">{property.shortTitle}</strong>
              <small className="split-line">{property.selectorLine}</small>
              <span className="split-cta">
                Discover
                <span className="split-cta-icon">
                  <ArrowIcon />
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className="grain-layer" />
      <div className="scroll-cue home-cue" aria-hidden="true">
        <span />
        Choose your escape
      </div>
    </main>
  );
}

export function PropertyLandingPage({ property }: { property: PropertyData }) {
  return (
    <main className={`property-page property-page-${property.slug}`}>
      <PropertyNav property={property} />
      <PropertyHero property={property} />
      <Intro property={property} />
      <Offers property={property} />
      {menuSections.map((item, index) => (
        <Chapter key={item.slug} section={property.sections[item.slug]} index={index} property={property} />
      ))}
      <QuoteBand property={property} />
      <BookingCta property={property} />
      <Footer property={property} />
      <WhatsAppWidget property={property} />
    </main>
  );
}

export function PropertyMenuPage({ property, section }: { property: PropertyData; section: PropertySection }) {
  const position = menuSections.findIndex((item) => item.slug === section.slug);
  const next = property.sections[menuSections[(position + 1) % menuSections.length].slug];

  return (
    <main className={`menu-page property-page-${property.slug}`}>
      <PropertyNav property={property} active={section.slug} />
      <section className="menu-hero" id="top">
        <img src={section.image} alt={section.alt} />
        <div className="hero-tint" />
        <div className="grain-layer" />
        <div className="menu-hero-content">
          <p className="eyebrow">{section.eyebrow}</p>
          <p className="property-name">{property.title}</p>
          <h1 className="words-rise">
            <Words text={section.title} />
          </h1>
          <p>{section.body}</p>
        </div>
        <span className="menu-hero-index" aria-hidden="true">
          {pad(position + 1)}
        </span>
      </section>
      <section className="menu-detail-grid">
        <div className="menu-lead" data-reveal>
          <span>{section.caption}</span>
          <h2>{section.secondary ?? section.meta}</h2>
          <p>{section.meta}</p>
          <Link className="link-arrow" href={`/${property.slug}`}>
            Back to {property.shortTitle}
            <ArrowIcon />
          </Link>
        </div>
        <div className="detail-cards">
          {section.details.map((detail, index) => (
            <article key={detail.title} data-reveal>
              {detail.image ? (
                <div className="detail-media" data-reveal="clip">
                  <img src={detail.image} alt={detail.alt ?? detail.title} />
                </div>
              ) : null}
              <div>
                <span className="detail-index">{pad(index + 1)}</span>
                <h3>{detail.title}</h3>
                <p>{detail.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Link className="next-chapter" href={`/${property.slug}/${next.slug}`}>
        <img src={next.image} alt="" />
        <span className="next-chapter-shade" />
        <span className="eyebrow">Next chapter</span>
        <strong>
          {next.label}
          <ArrowIcon />
        </strong>
        <small>{next.title}</small>
      </Link>
      <BookingCta property={property} />
      <Footer property={property} />
      <WhatsAppWidget property={property} />
    </main>
  );
}
