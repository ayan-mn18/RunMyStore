import {FormEvent, useState} from 'react';
import {ArrowRight, ArrowUpRight, Check, ChevronDown, Command, LayoutDashboard, Megaphone, Package, Sparkles, Store, Truck} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import {validWebURL} from '../domain';
import {Button, Modal} from '../ui';

const capabilities = [
  {icon: Store, number: '01', title: 'Shape the storefront', copy: 'Start with a considered storefront that feels like your brand, not another template marketplace.'},
  {icon: Package, number: '02', title: 'Keep the catalog clear', copy: 'Turn product details into polished listings, collections, and on-brand updates in one place.'},
  {icon: Megaphone, number: '03', title: 'Find the next customer', copy: 'Plan campaigns and creative from the same product truth you already approved.'},
  {icon: Truck, number: '04', title: 'Stay close to the work', copy: 'Orders, conversations, shipping, and decisions live together once the store is moving.'},
];

const faqs = [
  ['What is RunMyStore?', 'A single workspace for building, marketing, and operating a small online store. The demo is intentionally local and uses sample data.'],
  ['Do I need to move my store?', 'No. Start with the demo, or bring a store URL to preview how an import could feel before changing anything live.'],
  ['Is this an agency?', 'No. RunMyStore is the workspace; you stay in control of the decisions, accounts, payments, and customer relationships.'],
  ['Can I try it before signing up?', 'Yes. Open the demo to explore a complete store workspace with sample products, campaigns, orders, and customer conversations.'],
];

function StoreLinkForm({onSubmit, compact = false}: {onSubmit: (event: FormEvent<HTMLFormElement>) => void; compact?: boolean}) {
  return <form className={`rms-store-form ${compact ? 'rms-store-form-compact' : ''}`} onSubmit={onSubmit}>
    <div className="rms-store-input">
      <span className="rms-input-prefix">https://</span>
      <label className="sr-only" htmlFor={compact ? 'store-link-cta' : 'store-link-hero'}>Your store URL</label>
      <input id={compact ? 'store-link-cta' : 'store-link-hero'} name="site" type="text" inputMode="url" autoComplete="url" placeholder="yourstore.com" required />
    </div>
    <button className="rms-form-submit" type="submit">Preview my store <ArrowRight size={17}/></button>
  </form>;
}

export default function Landing() {
  const navigate = useNavigate();
  const [tour, setTour] = useState(false);

  const submitStore = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('site') as HTMLInputElement | null;
    if (!input || !validWebURL(input.value)) {
      input?.setCustomValidity('Enter a valid store URL, such as yourstore.com.');
      input?.reportValidity();
      input?.addEventListener('input', () => input.setCustomValidity(''), {once: true});
      return;
    }
    navigate(`/onboarding?site=${encodeURIComponent(input.value)}`);
  };

  return <div className="rms-new-landing">
    <header className="rms-site-header">
      <Link to="/" className="rms-wordmark" aria-label="RunMyStore home">RunMy<span>Store</span><b>.</b></Link>
      <nav className="rms-site-nav" aria-label="Primary navigation">
        <a href="#why">Why RunMyStore</a>
        <a href="#runs">What it runs</a>
        <a href="#bring">Bring your store</a>
        <a href="#questions">Questions</a>
      </nav>
      <Link to="/app/overview" className="rms-header-cta">Open demo <ArrowUpRight size={16}/></Link>
    </header>

    <main>
      <section className="rms-hero" aria-labelledby="rms-hero-title">
        <div className="rms-hero-glow" aria-hidden="true"/>
        <div className="rms-hero-copy">
          <p className="rms-kicker"><i/> THE STORE WORKSPACE FOR PEOPLE WHO DO THE WORK</p>
          <h1 id="rms-hero-title">Make room for the <em>good part</em> of running a store.</h1>
          <p className="rms-hero-lede">RunMyStore brings your storefront, catalog, marketing, and daily operations into one calm place.</p>
          <div className="rms-hero-actions">
            <StoreLinkForm onSubmit={submitStore}/>
            <p className="rms-form-note"><Check size={14}/> Try a store preview with no account required.</p>
          </div>
          <div className="rms-hero-meta">
            <span><Command size={14}/> One workspace</span>
            <span><Sparkles size={14}/> Built around your products</span>
            <span><LayoutDashboard size={14}/> Review before you publish</span>
          </div>
        </div>
        <div className="rms-hero-visual" aria-label="RunMyStore workspace preview">
          <div className="rms-preview-window">
            <div className="rms-preview-topbar">
              <div className="rms-preview-dots"><i/><i/><i/></div>
              <span>runmystore / northwind</span>
              <b>Live preview</b>
            </div>
            <div className="rms-preview-body">
              <div className="rms-preview-sidebar">
                <span className="rms-mini-mark">N</span>
                <i className="is-active"><LayoutDashboard size={14}/></i>
                <i><Store size={14}/></i>
                <i><Package size={14}/></i>
                <i><Megaphone size={14}/></i>
                <i><Truck size={14}/></i>
              </div>
              <div className="rms-preview-content">
                <div className="rms-preview-heading"><div><small>YOUR STORE, AT A GLANCE</small><h2>Good things. For everyday living.</h2></div><span className="rms-preview-status"><i/> Ready to review</span></div>
                <div className="rms-preview-banner">
                  <div><small>STOREFRONT</small><strong>Thoughtfully made essentials.</strong><p>A little more intention in the everyday.</p><button type="button" onClick={() => setTour(true)}>Explore workspace <ArrowRight size={14}/></button></div>
                  <img src="/assets/cat-window.webp" alt="Ceramic products arranged on a warm table"/>
                </div>
                <div className="rms-preview-stats"><span><small>PRODUCTS</small><b>24</b><em>catalogued</em></span><span><small>CAMPAIGNS</small><b>03</b><em>in motion</em></span><span><small>ORDERS</small><b>189</b><em>this month</em></span></div>
              </div>
            </div>
          </div>
          <div className="rms-float-note rms-float-note-top"><span className="rms-float-icon"><Sparkles size={15}/></span><span><b>One thoughtful change</b><small>applied for review</small></span><Check size={16}/></div>
          <div className="rms-float-note rms-float-note-bottom"><span className="rms-float-avatar">JD</span><span><b>Jamie, you have 3 orders</b><small>and one customer question</small></span><ArrowUpRight size={15}/></div>
        </div>
      </section>

      <section className="rms-proof-bar" aria-label="What RunMyStore brings together">
        <p>Everything your store needs to keep moving</p>
        <div><span>Storefront</span><i/> <span>Catalog</span><i/> <span>Campaigns</span><i/> <span>Orders</span><i/> <span>Customer care</span></div>
      </section>

      <section className="rms-section rms-why" id="why">
        <div className="rms-section-intro"><p className="rms-kicker rms-kicker-light">WHY RUNMYSTORE</p><h2>Your store is a lot of jobs. It should still feel like <em>one thing.</em></h2><p>Most tools add another tab. RunMyStore gives the work a home, so the next decision is easier to find and easier to make.</p></div>
        <div className="rms-why-grid"><article><span className="rms-card-index">01</span><strong>Less stitching things together.</strong><p>Your products, creative, campaigns, and conversations share the same context.</p></article><article><span className="rms-card-index">02</span><strong>More time for good judgment.</strong><p>Prepare drafts, suggestions, and next steps without handing over the final say.</p></article><article><span className="rms-card-index">03</span><strong>A store that stays yours.</strong><p>Use your accounts, your domain, and your data. Export it whenever you need it.</p></article></div>
      </section>

      <section className="rms-section rms-runs" id="runs">
        <div className="rms-section-heading"><div><p className="rms-kicker">WHAT IT RUNS</p><h2>From first product to <em>repeat customer.</em></h2></div><p>Say what needs doing. See the work take shape. Keep the final call.</p></div>
        <div className="rms-capability-grid">{capabilities.map(({icon: Icon, number, title, copy}, index) => <article key={title} className={`rms-capability rms-capability-${index + 1}`}><div className="rms-capability-icon"><Icon size={20}/></div><span>{number}</span><h3>{title}</h3><p>{copy}</p><a href="#bring">See how it works <ArrowUpRight size={14}/></a>{index < 3 && <img src={["/assets/potter-wheel.webp", "/assets/scene-warm.webp", "/assets/sunglasses.webp"][index]} alt="" loading="lazy"/>}</article>)}</div>
      </section>

      <section className="rms-section rms-bring" id="bring">
        <div className="rms-bring-visual"><img src="/assets/ui-looks.webp" alt="A preview of different storefront looks" loading="lazy"/><div className="rms-bring-tag"><i/> Your brand, your way</div></div>
        <div className="rms-bring-copy"><p className="rms-kicker">BRING YOUR STORE</p><h2>Start where you are. <em>Go from there.</em></h2><p>RunMyStore meets you at the link you already have and helps turn scattered store work into a rhythm you can keep.</p><ol><li><b>01</b><span><strong>Bring your link</strong><small>Preview your store and the shape of a better workspace.</small></span></li><li><b>02</b><span><strong>Make it yours</strong><small>Connect your products, tone, domain, and the tools you already use.</small></span></li><li><b>03</b><span><strong>Keep the good work moving</strong><small>Review changes, publish when ready, and stay close to every customer.</small></span></li></ol><Link to="/app/overview" className="rms-outline-button">Explore the demo <ArrowRight size={16}/></Link></div>
      </section>

      <section className="rms-quote"><p>“</p><blockquote>The point is not to automate the feeling out of commerce. It is to give the person running the store more room to make it feel like theirs.</blockquote><span>RunMyStore, for the work behind the storefront.</span></section>

      <section className="rms-section rms-questions" id="questions"><div className="rms-section-intro"><p className="rms-kicker">QUESTIONS</p><h2>The short <em>answers.</em></h2><p>A few useful things to know before you open the workspace.</p></div><div className="rms-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={17}/></summary><p>{answer}</p></details>)}</div></section>

      <section className="rms-cta"><div className="rms-cta-glow" aria-hidden="true"/><p className="rms-kicker rms-kicker-light">A BETTER PLACE TO RUN THE STORE</p><h2>Make the next good decision <em>easier.</em></h2><p>Bring your link. We’ll show you what RunMyStore can do with it.</p><StoreLinkForm onSubmit={submitStore} compact/><small><Check size={14}/> Free to explore · No payment details</small></section>
    </main>

    <footer className="rms-footer"><div className="rms-footer-main"><div className="rms-footer-brand"><Link to="/" className="rms-wordmark rms-wordmark-footer">RunMy<span>Store</span><b>.</b></Link><p>The calmer way to build, market, and run an online store.</p><span>© 2026 RunMyStore</span></div><div className="rms-footer-column"><small>EXPLORE</small><a href="#why">Why RunMyStore</a><a href="#runs">What it runs</a><a href="#bring">Bring your store</a><Link to="/app/overview">Open the demo</Link></div><div className="rms-footer-column"><small>RESOURCES</small><a href="#questions">Questions</a><Link to="/legal/privacy">Privacy</Link><Link to="/legal/terms">Terms</Link><a href="mailto:hello@runmystore.example">Contact us</a></div><div className="rms-footer-signoff"><span>Built for the people<br/>behind the storefront.</span><ArrowUpRight size={20}/></div></div><div className="rms-footer-bottom"><span>Made with care for small teams, independent brands, and their next good idea.</span><span>RunMyStore <i>·</i> Your store, in one place.</span></div></footer>

    {tour && <Modal title="Your store, in good hands." onClose={() => setTour(false)}><div className="tour-intro"><span className="eyebrow">A WORKING DEMO. A LITTLE POSSIBILITY.</span><h3>From your first product<br/>to your next big idea.</h3><p>Follow Northwind through catalog creation, storefront publishing, ad concepts, and campaign planning. Everything happens locally with demo data.</p><div className="tour-steps">01 &nbsp; Build your catalog<br/>02 &nbsp; Make it your store<br/>03 &nbsp; Find your next customer</div><Button onClick={() => navigate('/app/overview')}>Let's take a look <ArrowRight size={16}/></Button></div></Modal>}
  </div>;
}
