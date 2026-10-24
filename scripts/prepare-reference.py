"""Convert the supplied saved page to inert, local reference markup. Stdlib only."""
from html.parser import HTMLParser
from html import escape
from pathlib import Path
import re, shutil, json, argparse

ROOT = Path(__file__).resolve().parents[1]
args = argparse.ArgumentParser(description='Rebuild the local landing-page reference from a saved StoreOS page.')
args.add_argument('--source', type=Path, default=Path.home()/'Downloads'/'storeOS – The AI-native operating system for e-commerce.html', help='Saved reference HTML with its companion _files directory.')
SOURCE = args.parse_args().source.expanduser().resolve()
ASSETS = SOURCE.with_name(SOURCE.stem + '_files')
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Element:
    def __init__(self, tag='', attrs=(), parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []
    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Element): yield from child.walk()
    def has(self, name): return name in self.attrs.get('class','').split()
    def render(self):
        if not self.tag: return ''.join(c.render() if isinstance(c,Element) else escape(c) for c in self.children)
        attrs=''.join(' '+k+(('="'+escape(str(v),quote=True)+'"') if v is not None else '') for k,v in self.attrs.items())
        start='<'+self.tag+attrs+'>'
        return start if self.tag in VOID else start+''.join(c.render() if isinstance(c,Element) else escape(c) for c in self.children)+'</'+self.tag+'>'
    def text(self): return ''.join(c.text() if isinstance(c,Element) else c for c in self.children)
    def remove(self):
        if self.parent and self in self.parent.children: self.parent.children.remove(self)
class Parser(HTMLParser):
    def __init__(self): super().__init__(convert_charrefs=True); self.root=Element(); self.stack=[self.root]
    def handle_starttag(self, tag, attrs):
        node=Element(tag,attrs,self.stack[-1]); self.stack[-1].children.append(node)
        if tag not in VOID: self.stack.append(node)
    def handle_startendtag(self, tag, attrs): self.handle_starttag(tag,attrs); self.handle_endtag(tag)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag: self.stack=self.stack[:i]; break
    def handle_data(self, data): self.stack[-1].children.append(data)
p=Parser(); p.feed(SOURCE.read_text())
root=next(n for n in p.root.walk() if n.has('v2'))
public=ROOT/'public'; (public/'assets').mkdir(parents=True,exist_ok=True)
(ROOT/'src'/'generated').mkdir(parents=True,exist_ok=True)
copied=[]
for f in ASSETS.glob('*.webp'):
    shutil.copy2(f,public/'assets'/f.name); copied.append(f.name)
for name in ['Inter-var.woff2','JetBrainsMono-var.woff2']:
    if not (public/'assets'/name).is_file():
        raise SystemExit('Missing bundled font: public/assets/'+name+'. Restore the file from this repository before regenerating the reference.')
faq_answers=[
 'RunMyStore brings your storefront, catalog, ads, campaigns, and daily operations into one workspace. This interactive demo uses sample data saved in your browser.',
 'Open the demo to explore Northwind, use a local catalog CSV, or enter a store URL to preview a sample import. No account is required.',
 'The demo supports a website builder, catalog drafts, ad concepts, campaign tracking, budgets, orders, and customer conversations.',
 'You review changes before they are applied. Store publishing, ads, payments, and agent execution are simulated in this prototype.',
 'Your demo products and edits stay in this browser. URL imports use sample data; the entered website is never fetched.',
 'You can explore Shopify, WooCommerce, advertising, and shipping connection states in Settings. These are demonstration states, not live connections.',
 'The prototype is free to explore. No subscription, payment details, or real advertising spend is involved.',
 'Start with Open demo. Settings lets you export your browser data or reset the workspace for another walkthrough.'
]
faq_i=0
for n in list(root.walk()):
    if n.tag in ['script','iframe','noscript']: n.remove(); continue
    for key in list(n.attrs):
        if key.startswith('on') or key in ['data-waitlist','srcset','integrity','crossorigin']: n.attrs.pop(key,None)
    if 'mask-image' in n.attrs.get('style',''):
        n.attrs.pop('style',None)
        n.children=[n.attrs.get('aria-label','Demo')]
    for key in ['aria-label','title','alt']:
        if isinstance(n.attrs.get(key),str): n.attrs[key]=re.sub('storeOS','RunMyStore',n.attrs[key],flags=re.I)
    if n.has('wordtag'):
        n.tag='span'; n.attrs={'class':'rms-reference-logo','aria-label':'RunMyStore'}; n.children=['RunMyStore']; continue
    if n.has('d-proof') or n.has('m-proof'): n.children=['Explore 12 example storefronts']
    if n.has('d-backers') or n.has('m-backers'): n.attrs['aria-label']='Example workspace capabilities'
    if n.has('powered-mark'):
        label=n.attrs.get('aria-label') or 'Commerce'
        n.attrs.pop('style',None); n.attrs['class']='rms-powered-label'; n.children=[label.replace('Meta Business Partner','Meta Ads')]
    if n.tag=='img':
        path=n.attrs.get('src',''); name=path.rsplit('/',1)[-1]
        if name in copied: n.attrs['src']='/assets/'+name
        elif 'nvidia' in name: n.remove(); continue
        else: n.attrs['src']='/assets/store-hollow.webp'
    if n.tag in ['video','source']:
        if n.tag=='source': n.remove(); continue
        n.tag='button'; n.attrs={'class':'rms-film-demo','type':'button','data-demo-tour':'true','aria-label':'Explore the RunMyStore demo'}
        n.children=[Element('span',parent=n)]; n.children[0].children=['▶  Explore the interactive demo']
    if n.tag=='a':
        href=n.attrs.get('href','')
        if 'tally.so' in href or 'early' in n.text().lower(): n.attrs['href']='/app/overview'; n.children=['Open demo ↗']
        elif 'storeos.in/#' in href: n.attrs['href']='#'+href.split('#',1)[1]
        elif href in ['https://www.storeos.in/','/']: n.attrs['href']='/'
        elif 'privacy' in href: n.attrs['href']='/legal/privacy'
        elif 'terms' in href: n.attrs['href']='/legal/terms'
        elif not href.startswith('#') and not href.startswith('/'): n.attrs['href']='/app/settings'
    if n.tag=='form': n.attrs['action']='/onboarding'; n.attrs.pop('method',None)
    if n.tag=='p' and n.text().strip()=='Powered by': n.children=['One workspace for your whole store']
    if n.tag=='span' and n.text().strip()=='Business Partner': n.children=['Demo capabilities']
    if n.tag=='details':
        paragraphs=[x for x in n.walk() if x.tag=='p']
        for paragraph in paragraphs: paragraph.children=[faq_answers[faq_i%len(faq_answers)]]
        faq_i+=1
    for i,c in enumerate(n.children):
        if isinstance(c,str): n.children[i]=re.sub('storeOS','RunMyStore',c,flags=re.I).replace('60 brands are already on the waitlist','Explore 12 example storefronts')
html=root.render()
(ROOT/'src'/'generated'/'landing.html').write_text(html)
for filename,target in [('110h1qsw6-acw.css','reference-base.css'),('1vjswq1xn0fa1.css','reference-v2.css')]:
    css=(ASSETS/filename).read_text()
    css=re.sub(r'@font-face\{[^}]*\}', '', css)
    css=re.sub(r'url\([^)]*(?:sky-a|sky-b|night)[^)]*\)', 'linear-gradient(165deg,#dce8eb,#f5eee1 65%,#ecd6bf)',css)
    (public/target).write_text(css)
(ROOT/'asset-manifest.json').write_text(json.dumps({'source':str(SOURCE),'images':copied,'fonts':'Local Inter and JetBrains Mono; Georgia serif fallback','fidelityGaps':['Original Geist, Instrument Serif, Anton fonts unavailable','Original sky/night imagery unavailable; gradient fallback','Original product video unavailable; interactive demo entry replaces player'],'externalRequests':False},indent=2))
print('Prepared',len(copied),'local images and sanitized desktop/mobile reference markup.')
print('Buttons:', [(n.attrs.get('class'),n.text()[:70]) for n in root.walk() if n.tag=='button'][:30])
