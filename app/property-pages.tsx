/* eslint-disable @next/next/no-img-element -- Vinext dev does not provide ASSETS for local image optimization. */
import Link from "next/link";
import { menuSections, properties, type MenuSlug, type PropertyData, type PropertySection } from "./property-data";

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

function BrandLockup({ compact = false, href = "/" }: { compact?: boolean; href?: string }) {
  return (
    <Link className={compact ? "brand-lockup compact" : "brand-lockup"} href={href}>
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
      <BrandLockup compact href={`/${property.slug}`} />
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
          <HemoraIcon name="menu" className="menu-mark" />
          <HemoraIcon name="close" className="close-mark" />
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
        <BrandLockup compact href={`/${property.slug}`} />
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
            <div className="hero-stats hero-icon-stats" aria-label="Property highlights">
              {property.stats.map((stat, index) => (
                <div className="hero-stat icon-stat" key={`${stat.value}-${stat.label}`}>
                  <div className="stat-value-row">
                    <HemoraIcon name={heroStatIcons[index] ?? "bar"} className="hero-stat-icon" />
                    <strong>{stat.value}</strong>
                  </div>
                  <StatLabel label={stat.label} />
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
          {property.stats.map((stat, index) => (
            <div className="intro-stat icon-stat" key={stat.label}>
              <div className="stat-value-row">
                <HemoraIcon name={heroStatIcons[index] ?? "bar"} className="hero-stat-icon" />
                <strong>{stat.value}</strong>
              </div>
              <StatLabel label={stat.label} />
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
            <HemoraIcon name="hotel-simple" className="selector-property-icon" />
            <span>
              <strong>{properties.lereng.title}</strong>
              <small>Highland retreat above tea slopes</small>
            </span>
            <ArrowIcon />
          </Link>
          <Link className="selector-card" href="/sriti">
            <HemoraIcon name="hotel-simple" className="selector-property-icon" />
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
