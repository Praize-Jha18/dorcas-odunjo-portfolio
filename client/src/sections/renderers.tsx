import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Artwork } from '../lib/types';

type Data = Record<string, any>;

/** Renders "Technician by day, |Artist by soul.|" with the piped part as italic terracotta serif. */
export function Accent({ text }: { text?: string }) {
  if (!text) return null;
  const parts = String(text).split('|');
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="accent-i">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function SmartLink({ href, className, children }: { href?: string; className?: string; children: ReactNode }) {
  if (!href) return null;
  if (href.startsWith('/') && !href.startsWith('/uploads')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function SplitHero({ data }: { data: Data }) {
  return (
    <section className="split-hero">
      <div className="container split-hero-grid">
        <div>
          {data.eyebrow && <span className="eyebrow">{data.eyebrow}</span>}
          <h1 className="display">
            <Accent text={data.title} />
          </h1>
          <p>{data.body}</p>
          <div className="hero-actions">
            {data.primaryCta?.label && (
              <SmartLink href={data.primaryCta.href} className="btn btn-primary">
                {data.primaryCta.label}
              </SmartLink>
            )}
            {data.secondaryCta?.label && (
              <SmartLink href={data.secondaryCta.href} className="btn btn-ghost">
                {data.secondaryCta.label}
              </SmartLink>
            )}
          </div>
        </div>
        <div className="hero-figure">
          {data.image && <img src={data.image} alt={data.imageCaption || 'Portrait'} />}
          {data.imageCaption && <div className="hero-caption">{data.imageCaption}</div>}
        </div>
      </div>
    </section>
  );
}

export function PageHero({ data }: { data: Data }) {
  return (
    <section className="page-hero" id={data.anchor || undefined}>
      <div className={`container ${data.image ? 'page-hero-grid' : ''}`}>
        <div>
          {data.eyebrow && <span className="eyebrow">{data.eyebrow}</span>}
          <h1 className="display">
            <Accent text={data.title} />
          </h1>
          <p className="lead">{data.body}</p>
          <div className="hero-actions">
            {data.primaryCta?.label && (
              <SmartLink href={data.primaryCta.href} className="btn btn-primary">
                {data.primaryCta.label}
              </SmartLink>
            )}
            {data.secondaryCta?.label && (
              <SmartLink href={data.secondaryCta.href} className="btn btn-ghost">
                {data.secondaryCta.label}
              </SmartLink>
            )}
          </div>
          {Array.isArray(data.stats) && data.stats.length > 0 && (
            <div className="page-hero-stats">
              {data.stats.map((st: Data, i: number) => (
                <div key={i}>
                  <div className="value">{st.value}</div>
                  <div className="label">{st.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {data.image && (
          <div className="page-hero-figure">
            <img src={data.image} alt="" />
          </div>
        )}
      </div>
    </section>
  );
}

export function CardGrid({ data }: { data: Data }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="display">
            <Accent text={data.heading} />
          </h2>
          {data.subheading && <p>{data.subheading}</p>}
        </div>
        <div className="card-grid">
          {(data.cards ?? []).map((card: Data, i: number) => (
            <div className="essence-card" key={i}>
              {card.icon && <span className="material-symbols-outlined">{card.icon}</span>}
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <div className="tags">
                {(card.tags ?? []).map((t: string, j: number) => (
                  <span className="tag" key={j}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Intersection({ data }: { data: Data }) {
  return (
    <section className="section intersection">
      <div className="container intersection-grid">
        <div className="intersection-orb" aria-hidden />
        <div className="intersection-copy">
          <h2 className="display">
            <Accent text={data.heading} />
          </h2>
          <p>{data.body}</p>
          <div className="intersection-stats">
            {[data.leftStat, data.rightStat].filter(Boolean).map((st: Data, i: number) => (
              <div key={i}>
                <h4>{st.title}</h4>
                <p>{st.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaBanner({ data }: { data: Data }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="container">
        <div className={`cta-banner ${data.tone === 'dark' ? 'dark' : ''}`}>
          <div>
            <h2 className="display">
              <Accent text={data.heading} />
            </h2>
            {data.body && <p>{data.body}</p>}
          </div>
          {data.mode === 'button' ? (
            <SmartLink href={data.href || '/about'} className={`btn ${data.tone === 'dark' ? 'btn-light' : 'btn-primary'}`}>
              {data.buttonLabel || 'Get in touch'}
            </SmartLink>
          ) : sent ? (
            <span style={{ fontStyle: 'italic', fontFamily: 'var(--serif)' }}>Thank you — talk soon.</span>
          ) : (
            <form onSubmit={submit}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                {data.buttonLabel || 'Get in touch'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function DualIdentity({ data }: { data: Data }) {
  const side = (c: Data) =>
    c ? (
      <div className="dual-card">
        {c.icon && <span className="material-symbols-outlined">{c.icon}</span>}
        <h3>{c.title}</h3>
        <p>{c.body}</p>
        <div className="tags">
          {(c.tags ?? []).map((t: string, i: number) => (
            <span className="tag" key={i}>
              {t}
            </span>
          ))}
        </div>
      </div>
    ) : null;
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2 className="display">
            <Accent text={data.heading} />
          </h2>
        </div>
        <div className="dual-grid">
          {side(data.left)}
          {data.quote && <div className="dual-quote">“{data.quote}”</div>}
          {side(data.right)}
        </div>
      </div>
    </section>
  );
}

export function Contact({ data }: { data: Data }) {
  const [status, setStatus] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('Thank you — your message is noted. I will reply to you by email soon.');
  };
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact-card">
          <div className="contact-info">
            <h2 className="display">
              <Accent text={data.heading} />
            </h2>
            <p>{data.body}</p>
            {data.email && (
              <div className="contact-line">
                <span className="material-symbols-outlined">mail</span>
                <div>
                  <b>Email Me</b>
                  <span className="sub">{data.email}</span>
                </div>
              </div>
            )}
            {data.location && (
              <div className="contact-line">
                <span className="material-symbols-outlined">location_on</span>
                <div>
                  <b>The Atelier</b>
                  <span className="sub">{data.location}</span>
                </div>
              </div>
            )}
            {data.followHeading && <div className="contact-follow">{data.followHeading}</div>}
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="form-row">
              <div>
                <label>Full name</label>
                <input required placeholder="e.g. Adaeze Obi" />
              </div>
              <div>
                <label>Email address</label>
                <input type="email" required placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label>Nature of inquiry</label>
              <select>
                {(data.inquiryTypes ?? ['General']).map((t: string, i: number) => (
                  <option key={i}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label>How can we craft together?</label>
              <textarea required placeholder="Tell me about your vision…" />
            </div>
            {status && <div className="form-status">{status}</div>}
            <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-start' }}>
              {data.buttonLabel || 'Send'} <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Pillars({ data }: { data: Data }) {
  return (
    <section className="section" id={data.anchor || 'pillars'}>
      <div className="container">
        <div className="section-head">
          <h2 className="display">
            <Accent text={data.heading} />
          </h2>
          {data.subheading && <p>{data.subheading}</p>}
        </div>
        <div className="pillars-grid">
          {(data.items ?? []).map((p: Data, i: number) => (
            <div className={`pillar ${p.tone || ''}`} key={i}>
              <span className="mono">{p.icon || 'tactic'}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CaseStudies({ data }: { data: Data }) {
  return (
    <section className="section" id={data.anchor || 'case-studies'} style={{ background: 'var(--blush)' }}>
      <div className="container">
        <div className="section-head">
          <h2 className="display">
            <Accent text={data.heading} />
          </h2>
          {data.subheading && <p>{data.subheading}</p>}
        </div>
        {(data.items ?? []).map((c: Data, i: number) => (
          <div className="case-card" key={i}>
            <div className="case-body">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <div className="case-stats">
                {(c.stats ?? []).map((st: Data, j: number) => (
                  <div key={j}>
                    <div className="value">{st.value}</div>
                    <div className="label">{st.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {c.image && <img src={c.image} alt={c.title} />}
          </div>
        ))}
      </div>
    </section>
  );
}

export function Testimonials({ data }: { data: Data }) {
  return (
    <section className="section">
      <div className="container testimonials-grid">
        <div className="testimonial-copy">
          <h2 className="display" style={{ fontSize: 'clamp(26px,3.6vw,34px)', marginBottom: 16 }}>
            <Accent text={data.heading} />
          </h2>
          <p>{data.body}</p>
          {(data.quotes ?? []).map((q: Data, i: number) => (
            <div className="quote-chip" key={i}>
              “{q.text}”<span>— {q.author}</span>
            </div>
          ))}
        </div>
        <div className="testimonial-imgs">
          {(data.images ?? []).slice(0, 2).map((src: string, i: number) => (
            <img key={i} src={src} alt="" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function GalleryHero({ data }: { data: Data }) {
  return (
    <section className="gallery-hero">
      <div className="container">
        <div className="gallery-hero-card">
          {data.image && <img src={data.image} alt="" />}
          <div className="gallery-hero-content">
            {data.eyebrow && <span className="eyebrow">{data.eyebrow}</span>}
            <h1 className="display">
              <Accent text={data.title} />
            </h1>
            <p>{data.body}</p>
            {data.buttonLabel && (
              <a href="#works" className="btn btn-primary">
                {data.buttonLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function GalleryGrid({ data }: { data: Data }) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState('All Works');

  useEffect(() => {
    api
      .get<Artwork[]>('/api/artworks')
      .then(setArtworks)
      .finally(() => setLoaded(true));
  }, []);

  const categories = useMemo(
    () => ['All Works', ...Array.from(new Set(artworks.map((a) => a.category).filter(Boolean)))],
    [artworks]
  );
  const shown = filter === 'All Works' ? artworks : artworks.filter((a) => a.category === filter);

  return (
    <section className="section" id="works">
      <div className="container">
        {data.heading && (
          <div className="section-head">
            <h2 className="display">
              <Accent text={data.heading} />
            </h2>
            {data.intro && <p>{data.intro}</p>}
          </div>
        )}
        <div className="gallery-filters">
          {categories.map((c) => (
            <button key={c} className={filter === c ? 'active' : ''} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        {loaded && shown.length === 0 ? (
          <div className="art-empty">No pieces on display yet — the atelier is being rehung.</div>
        ) : (
          <div className="gallery-masonry">
            {shown.map((a) => (
              <div className="art-card" key={a._id}>
                {a.imageUrl && <img src={a.imageUrl} alt={a.title} loading="lazy" />}
                <div className="art-info">
                  <h3>{a.title}</h3>
                  <div className="art-meta">
                    {[a.medium, a.year].filter(Boolean).join(' · ')}
                    {a.category ? ` — ${a.category}` : ''}
                  </div>
                  {a.description && <div className="art-desc">{a.description}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Newsletter({ data }: { data: Data }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <section className="section" style={{ paddingTop: 30 }}>
      <div className="container">
        <div className="newsletter">
          <h2 className="display">
            <Accent text={data.heading} />
          </h2>
          <p>{data.body}</p>
          {sent ? (
            <span style={{ fontStyle: 'italic', fontFamily: 'var(--serif)' }}>Welcome to the atelier.</span>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-primary">{data.buttonLabel || 'Subscribe'}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export function RichText({ data }: { data: Data }) {
  return (
    <section className="section">
      <div className="container richtext">
        {data.eyebrow && <span className="eyebrow">{data.eyebrow}</span>}
        {data.heading && (
          <h2 className="display">
            <Accent text={data.heading} />
          </h2>
        )}
        {data.body && <p>{data.body}</p>}
        {data.image && <img src={data.image} alt="" />}
      </div>
    </section>
  );
}
