/* eslint-disable @next/next/no-img-element -- Vinext dev does not provide ASSETS for local image optimization. */
import Link from "next/link";
import { menuSections, properties, type MenuSlug, type PropertyData, type PropertySection } from "./property-data";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M19 12H6M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="whatsapp-mark" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M5.2 18.8 6 15.9a7 7 0 1 1 2.4 2.2l-3.2.7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.55" />
      <path
        d="M9.2 8.8c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.7l-.4.5c.5.9 1.2 1.6 2.2 2.1l.5-.5c.2-.2.4-.3.7-.2l1.5.7c.3.1.4.3.4.6v.4c0 .5-.5 1-1 1.1-2.9.4-6.9-3.1-6.5-6.4 0-.2 0-.3.1-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MountainIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M3 18.5 8.8 8.2l3.4 5.4 2.5-3.6L21 18.5H3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.55" />
      <path d="M8.8 8.2 11 12l1.2-2.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.55" />
    </svg>
  );
}

function AtriumIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M5 19V9.5C5 6.5 8.1 4 12 4s7 2.5 7 5.5V19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.55" />
      <path d="M9 19v-8.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5V19M4 19h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.55" />
    </svg>
  );
}

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={compact ? "brand-lockup compact" : "brand-lockup"} href="/">
      <img className="brand-logo" src="/assets/hemora/hemora-logo.png" alt="HEMORA" width={920} height={167} />
    </Link>
  );
}

function PropertyNav({ property, active }: { property: PropertyData; active?: MenuSlug }) {
  return (
    <header className="property-nav">
      <Link href="/" aria-label="Back to overview" className="back-link icon-only">
        <BackIcon />
      </Link>
      <BrandLockup compact />
      <nav className="desktop-menu" aria-label={`${property.shortTitle} menu`}>
        {menuSections.map((item) => (
          <Link key={item.slug} href={`/${property.slug}/${item.slug}`} className={item.slug === active ? "active" : undefined}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="nav-reserve" href={`/${property.slug}#book`}>
        Reserve
      </Link>
      <details className="mobile-menu">
        <summary aria-label={`Open ${property.shortTitle} menu`}>
          <span className="hamburger-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </summary>
        <nav className="mobile-menu-panel" aria-label={`${property.shortTitle} mobile menu`}>
          {menuSections.map((item) => (
            <Link key={item.slug} href={`/${property.slug}/${item.slug}`} className={item.slug === active ? "active" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
      </details>
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
      <img src={property.bookingImage} alt={property.bookingAlt} />
      <div className="booking-shade" />
      <div className="booking-content">
        <p className="eyebrow">§ 06 — Reserve</p>
        <h2>{property.bookingTitle}</h2>
        <p>{property.bookingLead}</p>
        <form className="booking-form">
          <label>
            <span>Arrival</span>
            <input defaultValue="2026-08-14" type="date" />
          </label>
          <label>
            <span>Departure</span>
            <input defaultValue="2026-08-16" type="date" />
          </label>
          <label>
            <span>Guests</span>
            <select defaultValue="2 adults">
              <option>2 adults</option>
              <option>3 adults</option>
              <option>4 adults</option>
              <option>Family</option>
            </select>
          </label>
          <label>
            <span>Room</span>
            <select defaultValue={property.offers[0].name}>
              {property.offers.map((offer) => (
                <option key={offer.name}>{offer.name}</option>
              ))}
            </select>
          </label>
        </form>
        <a className="primary-action booking-action" href="https://wa.me/6281234567890">
          Check Availability
          <ArrowIcon />
        </a>
      </div>
    </section>
  );
}

function Footer({ property }: { property: PropertyData }) {
  return (
    <footer className="site-footer">
      <div>
        <BrandLockup compact />
        <p>{property.address}</p>
        <a href={`mailto:${property.email}`}>{property.email}</a>
        <a href={`tel:${property.phone.replaceAll(" ", "")}`}>{property.phone}</a>
      </div>
      <nav aria-label={`${property.shortTitle} footer`}>
        <Link href={`/${property.slug}/stay`}>Stay</Link>
        <Link href={`/${property.slug}/dining`}>Dining</Link>
        <Link href={`/${property.slug}/wellness`}>Wellness</Link>
        <Link href={`/${property.slug}/journal`}>Journal</Link>
      </nav>
      <p>© 2026 Hemora · All rights reserved</p>
    </footer>
  );
}

function PropertyHero({ property }: { property: PropertyData }) {
  return (
    <section className="hero-stage">
      <img className="hero-image" src={property.heroImage} alt={property.heroAlt} />
      <div className="hero-tint" />
      <div className="fog-curtain left" />
      <div className="fog-curtain right" />
      <div className="hero-content">
        <div className="hero-topline">
          <p className="eyebrow">{property.heroKicker}</p>
          <p className="eyebrow">{property.tone}</p>
        </div>
        <div>
          <p className="property-name">{property.title}</p>
          <h1>
            {property.heroTitle}
            <br />
            <em>{property.heroEmphasis}</em>
          </h1>
          <div className="hero-lower-grid">
            <p>{property.intro}</p>
            <a className="primary-action" href="#book">
              {property.primaryAction}
              <ArrowIcon />
            </a>
            <div className="hero-stats" aria-label="Property highlights">
              {property.stats.map((stat) => (
                <div className="hero-stat" key={`${stat.value}-${stat.label}`}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true">
          <span />
          Scroll
        </div>
      </div>
    </section>
  );
}

function Intro({ property }: { property: PropertyData }) {
  return (
    <section className="property-intro">
      <div>
        <p className="eyebrow">{property.philosophyLabel}</p>
      </div>
      <div>
        <h2>{property.philosophyTitle}</h2>
        <p className="lead-copy">{property.philosophyLead}</p>
        <p>{property.philosophyBody}</p>
        <div className="intro-stats">
          {property.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Offers({ property }: { property: PropertyData }) {
  return (
    <section className="offers-section">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">§ 02 — Current Offerings</p>
          <h2>{property.offersTitle}</h2>
        </div>
        <p>{property.offersIntro}</p>
      </div>
      <div className="offers-carousel" aria-label={`${property.shortTitle} offers`}>
        {property.offers.map((offer) => (
          <article className="offer-card" key={offer.name}>
            <img src={offer.image} alt={offer.alt} />
            <div>
              <span>{offer.meta}</span>
              <h3>{offer.name}</h3>
              <p>{offer.description}</p>
              <strong>{offer.rate}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AlternatingBlock({ section, index, property }: { section: PropertySection; index: number; property: PropertyData }) {
  return (
    <section id={section.slug} className={index % 2 ? "alternating-block reverse" : "alternating-block"}>
      <div className="block-image">
        <img src={section.image} alt={section.alt} />
        <div>
          <span>{section.caption}</span>
          <span>{section.meta}</span>
        </div>
      </div>
      <div className="block-copy">
        <p className="eyebrow">{section.eyebrow}</p>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
        {section.secondary ? <p>{section.secondary}</p> : null}
        <Link className="link-arrow" href={`/${property.slug}/${section.slug}`}>
          Open {section.label}
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

function QuoteBand({ property }: { property: PropertyData }) {
  return (
    <section className="quote-band">
      <p className="eyebrow">§ 06 — In Other Words</p>
      <blockquote>{property.quote}</blockquote>
      <span>{property.quoteSource}</span>
      <div className="marquee-strip" aria-hidden="true">
        <div>
          {[...property.marquee, ...property.marquee].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeSelector() {
  return (
    <main className="selector-shell">
      <video className="selector-video" autoPlay muted loop playsInline preload="metadata" poster="/assets/hemora/lereng/hero.png" aria-hidden="true">
        <source src="/assets/hemora/hemora-hero.mp4" type="video/mp4" />
      </video>
      <div className="screen-tint home-tint" />
      <div className="grain-layer" />
      <header className="selector-topbar home-topbar">
        <BrandLockup />
        <nav className="selector-dots" aria-label="Property selector">
          <Link className="dot active" href="/" aria-label="Overview" />
          <Link className="dot" href="/lereng" aria-label="Lereng Senja" />
          <Link className="dot" href="/sriti" aria-label="Sriti Palu" />
        </nav>
      </header>
      <div className="selector-content home-selector-content">
        <p className="eyebrow">Two Sanctuaries · One Standard of Stillness</p>
        <div className="selector-actions" aria-label="Choose a HEMORA property">
          <Link className="selector-card" href="/lereng">
            <span className="selector-icon">
              <MountainIcon />
            </span>
            <span>
              <strong>{properties.lereng.title}</strong>
              <small>Highland retreat above tea slopes</small>
            </span>
            <ArrowIcon />
          </Link>
          <Link className="selector-card" href="/sriti">
            <span className="selector-icon">
              <AtriumIcon />
            </span>
            <span>
              <strong>{properties.sriti.title}</strong>
              <small>Warm city hotel with an atrium heart</small>
            </span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
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
        <AlternatingBlock key={item.slug} section={property.sections[item.slug]} index={index} property={property} />
      ))}
      <QuoteBand property={property} />
      <BookingCta property={property} />
      <Footer property={property} />
      <WhatsAppWidget property={property} />
    </main>
  );
}

export function PropertyMenuPage({ property, section }: { property: PropertyData; section: PropertySection }) {
  return (
    <main className={`menu-page property-page-${property.slug}`}>
      <PropertyNav property={property} active={section.slug} />
      <section className="menu-hero">
        <img src={section.image} alt={section.alt} />
        <div className="hero-tint" />
        <div>
          <p className="eyebrow">{section.eyebrow}</p>
          <p className="property-name">{property.title}</p>
          <h1>{section.title}</h1>
          <p>{section.body}</p>
        </div>
      </section>
      <section className="menu-detail-grid">
        <div className="menu-lead">
          <span>{section.caption}</span>
          <h2>{section.secondary ?? section.meta}</h2>
          <p>{section.meta}</p>
          <Link className="link-arrow" href={`/${property.slug}`}>
            Back to {property.shortTitle}
            <ArrowIcon />
          </Link>
        </div>
        <div className="detail-cards">
          {section.details.map((detail) => (
            <article key={detail.title}>
              {detail.image ? <img src={detail.image} alt={detail.alt ?? detail.title} /> : null}
              <div>
                <h3>{detail.title}</h3>
                <p>{detail.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <BookingCta property={property} />
      <Footer property={property} />
      <WhatsAppWidget property={property} />
    </main>
  );
}
