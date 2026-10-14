import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Castle, Check, ChevronDown, ChevronRight, CircleHelp,
  Cpu, Crown, Crosshair, Diamond, Disc3, Dices, Download, Flame, Gamepad2, Gem, Globe2, HardDrive, Hammer, Heart,
  LockKeyhole, Map, Menu, Monitor, Mountain, Music2, Package, Play, RotateCcw, ScrollText, Shield,
  ShieldCheck, Swords, Trophy, Users, Volume2, VolumeX, X, Youtube, Zap
} from 'lucide-react';
import { assets } from './assets';

type Section = 'home' | 'story' | 'world' | 'loot' | 'eternal' | 'compete' | 'donate' | 'demo';

const tabs: { id: Exclude<Section, 'home' | 'donate'>; label: string }[] = [
  { id: 'story', label: 'STORY' }, { id: 'world', label: 'WORLD' }, { id: 'loot', label: 'LOOT' },
  { id: 'eternal', label: 'ETERNAL' }, { id: 'compete', label: 'COMPETE' },
];
const donationCharacters = [
  { name: 'The Ash Warden', title: 'Guardian of the First Gate', price: 1, accent: '#d27e42', image: assets.characters[0] },
  { name: 'Veyra the Swift', title: 'Blade of the Reach', price: 5, accent: '#5fadd0', image: assets.characters[1] },
  { name: 'The Iron Vow', title: 'Knight Without A Banner', price: 10, accent: '#b5a17c', image: assets.characters[2] },
  { name: 'Cinder Saint', title: 'Flame-Born Exile', price: 50, accent: '#df704b', image: assets.characters[3] },
  { name: 'The Starforged', title: 'Heir to the Sky', price: 100, accent: '#d1ae5a', image: assets.characters[4] },
  { name: 'Malakar’s Bane', title: 'The Last Executioner', price: 500, accent: '#ad5a74', image: assets.characters[5] },
  { name: 'C’eleste Ascendant', title: 'Eternal Knight', price: 1000, accent: '#e1bd70', image: assets.characters[6] },
  { name: 'The Gate Sovereign', title: 'A Legend Beyond Worlds', price: 10000, accent: '#8ed0cf', image: assets.characters[7] },
];

const embers = Array.from({ length: 30 }, (_, index) => ({ left: `${(index * 37) % 101}%`, delay: `${(index * 1.7) % 14}s`, duration: `${9 + (index % 8)}s`, drift: `${((index % 5) - 2) * 24}px` }));
const kingdoms = ['Cinderhold', 'Veyra Reach', 'The Hollow March', 'Starfall Basin', 'Orrenwild', 'Blackwater', 'The Glass Expanse', 'Aster Vale', 'Dreadspire', 'Mourn Coast', 'Solenne', 'The Last Meridian'];
const features = [
  ['Action RPG Combat', Swords], ['Infinite Campaign', InfinityIcon], ['Death Isn’t The End', RotateCcw], ['Deep Loot System', Gem],
  ['Single-Player', Shield], ['Co-op Multiplayer', Users], ['Multiple Worlds', Globe2], ['Competitive Seasons', Trophy],
  ['Optional Digital Ownership', Diamond], ['No Pay-to-Win', Crosshair], ['Player History', ScrollText], ['Community Servers', Castle],
] as const;
const items = [
  { name: 'Ashen Longsword', rarity: 'legendary', icon: Swords, note: 'A blade that remembers every world.' },
  { name: 'Stellacite Shard', rarity: 'epic', icon: Diamond, note: 'Crystallized gateway residue.' },
  { name: 'Knight’s Vow', rarity: 'rare', icon: Shield, note: 'Armor for the road between lives.' },
  { name: 'Cinderleaf', rarity: 'common', icon: Flame, note: 'Bitter, bright, and useful.' },
  { name: 'Malakar’s Sigil', rarity: 'epic', icon: Crown, note: 'It watches from the other side.' },
  { name: 'Worldglass', rarity: 'rare', icon: Gem, note: 'A window into somewhere else.' },
];

function InfinityIcon({ size = 20 }: { size?: number }) { return <span style={{ fontSize: size, lineHeight: 1 }}>∞</span>; }
function Icon({ icon: Component, size = 18 }: { icon: React.ElementType; size?: number }) { return <Component size={size} strokeWidth={1.5} />; }
function Button({ children, onClick, variant = 'red', icon }: { children: ReactNode; onClick?: () => void; variant?: 'red' | 'gold' | 'ghost'; icon?: ReactNode }) {
  return <button onClick={onClick} className={`cinzel group inline-flex items-center justify-center gap-3 border px-6 py-3 text-[11px] font-bold tracking-[.22em] transition hover:-translate-y-0.5 hover:brightness-125 active:translate-y-0 ${variant === 'red' ? 'border-[#c99a51] bg-gradient-to-b from-[#8d2025] to-[#3b080d] text-[#f4dfb1] shadow-[0_8px_24px_rgba(98,13,16,.35)]' : variant === 'gold' ? 'border-[#e1bd75] bg-gradient-to-b from-[#d9ad5b] to-[#8e5e22] text-[#1d130d] shadow-[0_8px_24px_rgba(197,144,54,.2)]' : 'border-white/25 bg-white/5 text-[#ead9b7] hover:border-[#d9ac5f]'}`}>
    {icon}{children}<ChevronRight size={14} className="transition group-hover:translate-x-1" />
  </button>;
}
function Panel({ children, className = '' }: { children: ReactNode; className?: string }) { return <div className={`ornate-border relative bg-[#0c1728]/90 ${className}`}>{children}</div>; }
function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) { return <div className="max-w-2xl"><div className="cinzel mb-2 flex items-center gap-3 text-[10px] tracking-[.32em] text-[#d5a45c]"><span className="h-px w-8 bg-[#d5a45c]" />{eyebrow}</div><h2 className="display-title text-xl sm:text-2xl">{title}</h2>{text && <p className="mt-2 text-sm leading-relaxed text-[#cbbd9f] sm:text-base">{text}</p>}</div>; }

function App() {
  const [active, setActive] = useState<Section>('home');
  const [selectedKingdom, setSelectedKingdom] = useState(0);
  const [lootItem, setLootItem] = useState(0);
  const [deathState, setDeathState] = useState<'idle' | 'fallen' | 'victory'>('idle');
  const [sound, setSound] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const audioRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<{ left: OscillatorNode; right: OscillatorNode; gain: GainNode } | null>(null);
  const navigationLockRef = useRef(false);

  const playSfx = () => {
    if (!sound) return;
    const context = audioRef.current ?? new AudioContext();
    audioRef.current = context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(620, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(920, context.currentTime + 0.08);
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.13);
  };
  const toggleSound = () => { const next = !sound; setSound(next); if (next) playSfx(); };
  useEffect(() => {
    if (!sound) { ambientRef.current?.left.stop(); ambientRef.current?.right.stop(); ambientRef.current?.gain.disconnect(); ambientRef.current = null; return; }
    const context = audioRef.current ?? new AudioContext();
    audioRef.current = context;
    const gain = context.createGain();
    const left = context.createOscillator();
    const right = context.createOscillator();
    gain.gain.value = 0.018;
    left.type = 'sine'; right.type = 'triangle';
    left.frequency.value = 73.42; right.frequency.value = 110;
    left.connect(gain).connect(context.destination); right.connect(gain);
    left.start(); right.start();
    ambientRef.current = { left, right, gain };
    return () => { left.stop(); right.stop(); gain.disconnect(); ambientRef.current = null; };
  }, [sound]);

  const goTo = (section: Section) => { playSfx(); setActive(section); setMenuOpen(false); };
  useEffect(() => {
    const menuItems: Section[] = [...tabs.map(tab => tab.id), 'donate', 'demo'];
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'escape') return goTo('home');
      if (key === 'enter' && active === 'home') return goTo('story');
      const movement: Record<string, number> = { arrowup: -1, w: -1, arrowleft: -1, a: -1, arrowdown: 1, s: 1, arrowright: 1, d: 1 };
      const direction = movement[key];
      if (!direction) return;
      event.preventDefault();
      const current = active === 'home' ? (direction > 0 ? -1 : 0) : menuItems.indexOf(active);
      const next = (current + direction + menuItems.length) % menuItems.length;
      goTo(menuItems[next]);
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [active]);
  useEffect(() => {
    const onMove = (event: MouseEvent) => setParallax({ x: (event.clientX / window.innerWidth - .5) * 12, y: (event.clientY / window.innerHeight - .5) * 8 });
    window.addEventListener('mousemove', onMove); return () => window.removeEventListener('mousemove', onMove);
  }, []);
  useEffect(() => {
    const menuItems: Section[] = ['home', ...tabs.map(tab => tab.id), 'donate', 'demo'];
    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth <= 768) return;
      event.preventDefault();
      if (navigationLockRef.current) return;
      navigationLockRef.current = true;
      const direction = event.deltaY > 0 ? 1 : -1;
      const current = menuItems.indexOf(active);
      const next = (current + direction + menuItems.length) % menuItems.length;
      goTo(menuItems[next]);
      setTimeout(() => { navigationLockRef.current = false; }, 12000);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [active]);
  useEffect(() => {
    const menuItems: Section[] = ['home', ...tabs.map(tab => tab.id), 'donate', 'demo'];
    let startY: number | null = null;
    const onTouchStart = (event: TouchEvent) => { startY = event.changedTouches[0]?.clientY ?? null; };
    const onTouchEnd = (event: TouchEvent) => {
      if (window.innerWidth > 768 || startY === null || navigationLockRef.current) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, input, textarea, a')) { startY = null; return; }
      const delta = startY - (event.changedTouches[0]?.clientY ?? startY);
      startY = null;
      if (Math.abs(delta) < 70) return;
      const current = menuItems.indexOf(active);
      const next = (current + (delta > 0 ? 1 : -1) + menuItems.length) % menuItems.length;
      navigationLockRef.current = true;
      goTo(menuItems[next]);
      window.setTimeout(() => { navigationLockRef.current = false; }, 12000);
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => { window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchend', onTouchEnd); };
  }, [active]);

  return <main className="h-screen overflow-hidden bg-[#080d17] text-[#f0e5ce]">
    <div key={active} className="page-flip h-full">
      {active === 'home' ? <Home onNavigate={goTo} parallax={parallax} sound={sound} setSound={setSound} toggleSound={toggleSound} menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> : <GameSection active={active} onNavigate={goTo} selectedKingdom={selectedKingdom} setSelectedKingdom={setSelectedKingdom} lootItem={lootItem} setLootItem={setLootItem} deathState={deathState} setDeathState={setDeathState} menuOpen={menuOpen} setMenuOpen={setMenuOpen} sound={sound} toggleSound={toggleSound} playSfx={playSfx} />}
    </div>
    <Footer onNavigate={goTo} />
  </main>;
}

function Header({ onNavigate, sound, setSound }: { onNavigate: (section: Section) => void; sound: boolean; setSound: (value: boolean) => void }) {
  return <header className="absolute inset-x-0 top-0 z-40 flex items-start justify-between px-5 py-5 sm:px-10 lg:px-14">
    <button onClick={() => onNavigate('home')} className="cinzel text-left text-xs tracking-[.3em] text-[#d8b674] transition hover:text-white">LIFE<br /><span className="text-[#f0e8d8]">ETERNAL</span><span className="ml-2 text-[8px] tracking-[.1em] text-[#a48046]">/ 01</span></button>
    <div className="hidden items-start gap-2 sm:flex"><Button variant="red" onClick={() => onNavigate('story')} icon={<Play size={13} fill="currentColor" />}>PLAY FREE DEMO</Button><div className="text-center"><Button variant="gold" onClick={() => alert('Thank you for supporting Life Eternal.')} icon={<Heart size={13} fill="currentColor" />}>DONATE</Button><div className="mt-1 text-[10px] tracking-[.08em] text-[#d7b978]">Support us for special in-game loot</div></div><button onClick={() => setSound(!sound)} aria-label="Toggle sounds" className="ml-1 mt-2 text-[#d9b66e] hover:text-white">{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button></div>
  </header>;
}

function SideNav({ active, onNavigate, menuOpen, setMenuOpen, sound, toggleSound }: { active: Section; onNavigate: (section: Section) => void; menuOpen: boolean; setMenuOpen: (value: boolean) => void; sound: boolean; toggleSound: () => void }) {
  return <><button className="fixed right-5 top-5 z-50 border border-[#d7ad64]/60 bg-[#0a1220]/90 p-3 text-[#e8c980] sm:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button><nav className={`${menuOpen ? 'flex' : 'hidden'} fixed inset-x-5 top-20 z-40 flex-col gap-1 sm:fixed sm:right-8 sm:top-28 sm:flex sm:w-40 sm:inset-x-auto`} aria-label="Game navigation">{tabs.map(tab => <button key={tab.id} aria-current={active === tab.id ? 'page' : undefined} onClick={() => onNavigate(tab.id)} className={`tab cinzel flex h-10 items-center justify-center border border-[#9b7135]/45 bg-[#e5cb99] px-5 text-[10px] font-bold tracking-[.25em] text-[#26170f] shadow-lg ${active === tab.id ? 'border-[#e9ba68]' : ''}`}>{tab.label}</button>)}{active !== 'home' && <><button onClick={() => onNavigate('donate')} className={`tab cinzel flex h-10 items-center justify-center border border-[#b7914f] bg-gradient-to-r from-[#d7ac5b] to-[#926126] px-5 text-[10px] font-bold tracking-[.2em] text-[#20150d] shadow-lg ${active === 'donate' ? 'brightness-125' : ''}`}>DONATE</button><button onClick={() => onNavigate('demo')} className="tab cinzel flex h-10 items-center justify-center border border-[#c99a51] bg-gradient-to-r from-[#8d2025] to-[#3b080d] px-5 text-[10px] font-bold tracking-[.16em] text-[#f4dfb1] shadow-lg">PLAY FREE DEMO</button></>}{<button onClick={toggleSound} className="mx-auto mt-3 flex items-center gap-2 text-[9px] font-bold tracking-[.18em] text-[#8b6a35]" aria-label="Toggle atmospheric audio">{sound ? <Volume2 size={14} /> : <VolumeX size={14} />} {sound ? 'SOUND ON' : 'SOUND OFF'}</button>}</nav></>;
}

function Home({ onNavigate, parallax, sound, setSound, toggleSound, menuOpen, setMenuOpen }: { onNavigate: (section: Section) => void; parallax: { x: number; y: number }; sound: boolean; setSound: (value: boolean) => void; toggleSound: () => void; menuOpen: boolean; setMenuOpen: (value: boolean) => void }) {
  return <section className="game-frame relative overflow-hidden border-b border-[#bb8d4b]/30"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,#8d765d_0%,#314654_27%,#111d2d_60%,#080d17_100%)]" /><div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${assets.heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(.35) sepia(.25)' }} /><div className="absolute inset-0 bg-[linear-gradient(90deg,#07101c_4%,transparent_63%),linear-gradient(0deg,#080d17_1%,transparent_42%)]" /><div className="absolute right-[-12%] top-[12%] h-[72%] w-[62%] opacity-85" style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}><div className="absolute bottom-0 right-[24%] h-[82%] w-[21%] rounded-t-[45%] bg-[linear-gradient(90deg,#090d16,#273446_45%,#0b111b)] shadow-[-30px_0_80px_#000]" /><div className="absolute bottom-[4%] right-[8%] h-[12%] w-[58%] rotate-[-8deg] bg-[#111622] shadow-[0_14px_25px_#000]" /><div className="absolute right-[17%] top-[29%] h-[47%] w-[6%] rotate-[-26deg] bg-[linear-gradient(90deg,#76736b,#ded0a9,#3c3e41)] shadow-[0_0_16px_#cfa864]" /></div>
    {embers.map((ember, index) => <i key={index} className="ember" style={{ left: ember.left, bottom: '-10px', animationDelay: ember.delay, animationDuration: ember.duration, ['--drift' as string]: ember.drift }} />)}
    <SideNav active="home" onNavigate={onNavigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} sound={sound} toggleSound={toggleSound} />
    <div className="relative z-30 mx-auto flex h-full max-w-[1440px] flex-col justify-center px-7 sm:px-14 lg:px-20"><div className="max-w-xl"><div className="cinzel mb-4 flex items-center gap-3 text-[10px] tracking-[.38em] text-[#cf9c4d]"><span className="h-px w-12 bg-[#cf9c4d]" />A FOREVER-FREE ACTION RPG</div><h1 className="display-title text-[24px] sm:text-[36px] lg:text-[48px]">LIFE<br /><span className="relative">ETERNAL<i className="absolute left-[49%] top-[-8%] h-[121%] w-px rotate-[8deg] bg-gradient-to-b from-transparent via-[#ffbc67] to-transparent shadow-[0_0_9px_#ff6f1e]" /></span></h1><div className="mt-6 max-w-md border-l-2 border-[#a67b40] pl-5"><h2 className="cinzel text-lg leading-snug tracking-[.18em] text-[#e0b86e] sm:text-xl">THE LAST KNIGHT.<br />AN ENDLESS WAR.</h2><p className="mt-3 text-base leading-relaxed text-[#dfd3ba]">The Demon King Malakar is building a gateway to conquer the multiverse. You are C'eleste, the last surviving knight of an ancient order. Die, grow stronger, and try again.</p></div><div className="mt-6 flex flex-wrap gap-3"><Button onClick={() => onNavigate('demo')} variant="red" icon={<Play size={14} fill="currentColor" />}>PLAY FREE DEMO</Button><Button onClick={() => onNavigate('donate')} variant="gold" icon={<Heart size={14} />}>DONATE</Button></div><div className="cinzel mt-4 flex items-center gap-4 text-[9px] tracking-[.2em] text-[#a99d87]"><span className="flex items-center gap-2"><Gamepad2 size={14} /> PC</span><span className="h-3 w-px bg-[#806844]" /><span>ANDROID</span><span className="h-3 w-px bg-[#806844]" /><span>iOS</span></div></div></div><div className="scroll-hint absolute bottom-20 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 text-[10px] tracking-[.18em] text-[#9f967f] lg:flex"><ChevronDown size={14} /> SCROLL TO EXPLORE</div></section>;
}

function HeroPanel() { return <Panel className="absolute bottom-10 right-8 z-30 hidden w-72 p-6 lg:block"><div className="cinzel mb-4 text-[10px] tracking-[.25em] text-[#d1a85e]">THE ETERNAL OATH</div>{[['Infinite Campaign', Globe2], ['Death Isn’t The End', RotateCcw], ['No Pay-to-Win', Shield]].map(([label, icon]) => <div key={label as string} className="flex items-center gap-4 border-t border-white/10 py-3 text-[#d2c8b4]"><Icon icon={icon as React.ElementType} size={20} /><span className="text-lg">{label as string}</span></div>)}</Panel>; }

function GameSection({ active, onNavigate, selectedKingdom, setSelectedKingdom, lootItem, setLootItem, deathState, setDeathState, menuOpen, setMenuOpen, sound, toggleSound, playSfx }: { active: Exclude<Section, 'home'>; onNavigate: (section: Section) => void; selectedKingdom: number; setSelectedKingdom: (value: number) => void; lootItem: number; setLootItem: (value: number) => void; deathState: 'idle' | 'fallen' | 'victory'; setDeathState: (value: 'fallen' | 'victory' | 'idle') => void; menuOpen: boolean; setMenuOpen: (value: boolean) => void; sound: boolean; toggleSound: () => void; playSfx: () => void }) {
  return <section className="game-frame bg-[radial-gradient(ellipse_at_top,#1c3040,#0c1423_55%,#080d17)]"><SideNav active={active} onNavigate={onNavigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} sound={sound} toggleSound={toggleSound} /><div className="relative z-30 mx-auto flex h-full min-h-0 max-w-[1600px] flex-col px-5 pt-10 pb-20 sm:px-10 sm:pt-12 sm:pb-20 lg:pr-48"><button onClick={() => onNavigate('home')} className="cinzel mb-3 flex shrink-0 items-center gap-2 text-[10px] tracking-[.22em] text-[#c6a05e] hover:text-white sm:mb-4"><ArrowLeft size={14} /> RETURN TO TITLE</button><div className="min-h-0 flex-1 overflow-hidden">{active === 'story' && <Story />}{active === 'world' && <World selected={selectedKingdom} setSelected={setSelectedKingdom} />}{active === 'loot' && <Loot selected={lootItem} setSelected={setLootItem} />}{active === 'eternal' && <Eternal state={deathState} setState={setDeathState} />}{active === 'compete' && <Compete />}{active === 'donate' && <Donate playSfx={playSfx} />}{active === 'demo' && <Demo />}</div></div></section>;
}

function CharacterArt({ character, large = false }: { character: typeof donationCharacters[number]; large?: boolean }) { return <div className={`character-art relative min-h-0 overflow-hidden ${large ? 'h-full' : 'h-28'} w-full`} style={{ backgroundImage: `url(${character.image}), radial-gradient(circle at 50% 30%, ${character.accent}66, transparent 30%), linear-gradient(135deg, #172438, #080c15 72%)` }}><div className="character-aura absolute left-1/2 top-[18%] h-20 w-20 -translate-x-1/2 rounded-full" style={{ backgroundColor: `${character.accent}33` }} /><div className="character-silhouette absolute bottom-0 left-1/2 h-[78%] w-[30%] -translate-x-1/2 rounded-t-[45%]" style={{ background: `linear-gradient(90deg, #070a11, ${character.accent}99 45%, #090c13 72%)`, boxShadow: `0 0 40px ${character.accent}33` }} /><div className="character-blade absolute bottom-[13%] left-[62%] h-[65%] w-1 rotate-[24deg]" style={{ backgroundColor: character.accent, boxShadow: `0 0 12px ${character.accent}` }} /><div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-transparent to-transparent" /></div>; }

function Donate({ playSfx }: { playSfx: () => void }) {
  const [selected, setSelected] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [payment, setPayment] = useState<'card' | 'crypto'>('card');
  const character = donationCharacters[selected];
  const choose = (index: number) => { setSelected(index); playSfx(); };
  return <div className="donation-screen flex h-full min-h-0 flex-col">
    <SectionHeading eyebrow="THE OFFERING / SUPPORT THE ETERNAL WAR" title="CHOOSE YOUR LEGEND" text="Select a contribution and your champion. Every contribution helps keep Life Eternal forever-free." />
    <div className="mt-3 grid min-h-0 flex-1 gap-3 lg:grid-cols-[.75fr_1.25fr] lg:items-stretch">
      <Panel className="hidden min-h-0 flex-col overflow-hidden p-3 sm:p-4 lg:flex">
        <div className="mb-2 flex items-center justify-between"><span className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">SELECT AMOUNT</span><span className="text-xs text-[#a89b85]">{donationCharacters.length} OPTIONS</span></div>
        <div className="hidden grid-cols-2 gap-2 sm:grid-cols-4 lg:grid">{donationCharacters.map((entry, index) => <button key={entry.price} onClick={() => choose(index)} aria-label={`Donate $${entry.price}`} className={`character-card flex min-h-16 items-center justify-center p-3 ${selected === index ? 'character-card-selected' : ''}`}><span className="cinzel text-xl tracking-[.12em] text-[#f1ce86]">${entry.price.toLocaleString()}</span></button>)}</div>
        <div className="flex min-h-24 items-center justify-center text-center lg:hidden"><div><div className="cinzel text-[10px] tracking-[.2em] text-[#d5a45c]">SWIPE OR USE THE ARROWS</div><div className="mt-2 text-sm text-[#bdb4a0]">Choose your support level below</div></div></div>
        <div className="mt-auto hidden items-center gap-4 border-t border-[#d2ad64]/30 pt-4 lg:flex"><Button variant="gold" onClick={() => setCheckoutOpen(true)} icon={<Heart size={14} fill="currentColor" />}>DONATE</Button><div><div className="cinzel text-[10px] tracking-[.18em] text-[#d5a45c]">YOUR CONTRIBUTION</div><div className="cinzel mt-1 text-2xl text-[#f1ce86]">${character.price.toLocaleString()}</div></div></div>
      </Panel>
      <Panel className="preview-panel relative min-h-0 flex flex-col overflow-hidden p-3 sm:p-4">
        <div className="cinzel shrink-0 text-[10px] tracking-[.3em]" style={{ color: character.accent }}>SELECTED CHAMPION / ${character.price.toLocaleString()}</div>
        <div className="relative min-h-0 flex-1 overflow-hidden"><CharacterArt character={character} large /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#070c15] via-[#070c15dd] to-transparent px-4 pb-3 pt-16"><h3 className="display-title text-xl sm:text-2xl">{character.name}</h3><p className="mt-1 text-base italic text-[#d2c6ad]">{character.title}</p></div></div>
        <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-[#d2ad64]/30 pt-3 lg:hidden"><button onClick={() => choose((selected - 1 + donationCharacters.length) % donationCharacters.length)} className="border border-[#b78a4a]/60 px-2 py-3 text-xs text-[#e5c47d]">← ${donationCharacters[(selected - 1 + donationCharacters.length) % donationCharacters.length].price.toLocaleString()}</button><button onClick={() => setCheckoutOpen(true)} className="border border-[#e2b967] bg-gradient-to-b from-[#d9ad5b] to-[#8e5e22] px-3 py-3 text-xs font-bold tracking-[.08em] text-[#1d130d]">BUY FOR ${character.price.toLocaleString()}</button><button onClick={() => choose((selected + 1) % donationCharacters.length)} className="border border-[#b78a4a]/60 px-2 py-3 text-xs text-[#e5c47d]">${donationCharacters[(selected + 1) % donationCharacters.length].price.toLocaleString()} →</button></div>
      </Panel>
    </div>
    {checkoutOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03060d]/80 p-4 backdrop-blur-sm"><Panel className="w-full max-w-md bg-[#0c1728] p-5 sm:p-6"><div className="flex items-start justify-between"><div><div className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">SECURE CHECKOUT</div><h3 className="mt-2 text-2xl text-[#eee0c2]">Donate ${character.price.toLocaleString()}</h3></div><button onClick={() => setCheckoutOpen(false)} aria-label="Close checkout" className="text-[#c9a05a] hover:text-white"><X size={20} /></button></div><label className="cinzel mt-5 block text-[10px] tracking-[.18em] text-[#d5a45c]">EMAIL ADDRESS<input value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="you@example.com" className="mt-2 w-full border border-white/15 bg-[#08111e] px-3 py-3 font-sans text-sm tracking-normal text-[#f0e5ce] outline-none focus:border-[#d9ac5f]" /></label><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => setPayment('card')} className={`border p-3 text-sm ${payment === 'card' ? 'border-[#e2b967] bg-[#d2a85d]/15 text-[#f1ce86]' : 'border-white/15 text-[#bdb4a0]'}`}>Credit card</button><button onClick={() => setPayment('crypto')} className={`border p-3 text-sm ${payment === 'crypto' ? 'border-[#e2b967] bg-[#d2a85d]/15 text-[#f1ce86]' : 'border-white/15 text-[#bdb4a0]'}`}>Crypto</button></div><Button variant="gold" onClick={() => alert(`Checkout started for ${email || 'your email'} via ${payment === 'card' ? 'credit card' : 'crypto'}.`)} icon={<Check size={14} />}>CONTINUE TO CHECKOUT</Button></Panel></div>}
  </div>;
}

function Demo() { return <div className="demo-screen flex h-full flex-col"><SectionHeading eyebrow="THE FIRST GATE / PC DEMO" title="ENTER THE ETERNAL WAR" text="Download the free PC demo and take your first step through the gateway. Your progress is yours to keep." /><div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1.1fr_.9fr]"><Panel className="p-4 sm:p-6"><div className="flex items-center justify-between border-b border-[#c49b58]/30 pb-3"><div><div className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">LIFE ETERNAL / PC DEMO</div><h3 className="mt-1 text-2xl text-[#ebdfc5]">The First World</h3></div><Monitor className="text-[#d5a45c]" size={24} /></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><Requirement icon={Cpu} label="Processor" value="Intel Core i5-8400 / AMD Ryzen 5 2600" /><Requirement icon={Monitor} label="Graphics" value="GTX 1060 6GB / RX 580 8GB" /><Requirement icon={HardDrive} label="Storage" value="35 GB available space" /><Requirement icon={ShieldCheck} label="Operating system" value="Windows 10 64-bit or newer" /></div><div className="mt-4 border border-[#d2a85d]/30 bg-[#d2a85d]/5 p-3"><div className="cinzel text-[10px] tracking-[.2em] text-[#dcb267]">RECOMMENDED</div><p className="mt-1 text-sm text-[#d0c4ac]">16 GB RAM · RTX 2060 / RX 6600 · Broadband internet connection</p></div></Panel><Panel className="relative flex flex-col justify-between overflow-hidden p-5 sm:p-6"><div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_32%,rgba(213,154,69,.25),transparent_24%),linear-gradient(135deg,#172b39,#090f1b)]" /><div className="absolute right-[16%] top-[12%] h-40 w-24 rounded-[50%] border border-[#d5a45c]/40 shadow-[0_0_45px_rgba(213,164,92,.18)]" /><div className="relative"><div className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">NO ACCOUNT REQUIRED</div><h3 className="mt-3 text-3xl text-[#eee0c2]">A forever-free beginning.</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-[#c9bea9]">Play the opening chapter solo or bring a friend. No pay-to-win systems. No time limit.</p></div><div className="relative"><Button variant="red" onClick={() => alert('The Life Eternal PC demo installer will be available here soon.')} icon={<Download size={15} />}>DOWNLOAD PC DEMO</Button><p className="mt-2 text-xs text-[#928a7b]">Windows installer · 4.2 GB · Version 0.1.0</p></div></Panel></div><div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#a7a092]"><span className="flex items-center gap-1"><Check size={13} className="text-[#d4a75d]" /> Demo progress carries forward</span><span className="flex items-center gap-1"><Users size={13} className="text-[#d4a75d]" /> Solo and co-op ready</span><span className="flex items-center gap-1"><ShieldCheck size={13} className="text-[#d4a75d]" /> Safe, direct download</span></div></div>; }
function Requirement({ icon: Component, label, value }: { icon: React.ElementType; label: string; value: string }) { return <div className="border border-white/10 bg-white/[.03] p-4"><Component size={19} className="text-[#d4a75d]" /><div className="cinzel mt-3 text-[10px] tracking-[.16em] text-[#d2a85e]">{label}</div><p className="mt-1 text-base leading-snug text-[#c7bca6]">{value}</p></div>; }

function Story() { return <div className="flex h-full flex-col"><SectionHeading eyebrow="QUEST JOURNAL / ENTRY 01" title="THE LAST ORDER" text="Memories return in fragments. Every world holds a piece of the truth." /><div className="mt-4 grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.25fr_.75fr]"><Panel className="min-h-0 overflow-hidden p-4 sm:p-6"><div className="mb-3 flex items-center justify-between border-b border-[#c49b58]/30 pb-3"><span className="cinzel text-xs tracking-[.25em] text-[#d5a45c]">CHRONICLE OF C’ELESTE</span><BookOpen size={16} className="text-[#c9a05a]" /></div><div className="space-y-4 text-base leading-relaxed text-[#c8bfad] sm:text-lg"><p>The Demon King Malakar has opened a gateway between worlds. You are C’eleste, the last surviving knight of an ancient order sworn to destroy him. Five years after being left for dead, you awaken to a world consumed by mutants, alien forces, enslaved kingdoms, and a war that has become something far greater than anyone imagined.</p><p>Malakar isn't trying to conquer one kingdom. He wants to conquer the multiverse.<br />And only you can stop him.</p></div></Panel><Panel className="flex flex-col justify-between overflow-hidden p-4 sm:p-5"><div><div className="mb-3 flex items-center gap-3 text-[#d55f45]"><Flame size={16} /><span className="cinzel text-[10px] tracking-[.25em]">TARGET / DEMON KING</span></div><h3 className="display-title text-xl">MALAKAR</h3><p className="mt-3 text-sm leading-relaxed text-[#c8bba3]">He wants the multiverse. Every time you defeat him, the gateway leads somewhere else.</p></div><div className="mt-4 border-t border-[#bd8e4e]/30 pt-2 text-xs text-[#a99b84]">THREAT LEVEL <span className="float-right text-[#d95b3d]">ETERNAL</span></div></Panel></div></div>; }

function World({ selected, setSelected }: { selected: number; setSelected: (value: number) => void }) { return <div className="flex h-full flex-col"><SectionHeading eyebrow="ATLAS / 12 KINGDOMS" title="A WORLD AT WAR" text="The gateway does not lead to one world. It leads to all of them. Choose a banner to read its trace." /><div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1.3fr_.7fr]"><Panel className="relative overflow-hidden p-4"><div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,#56706b,#172b38_42%,#0b1422_74%)]" /><div className="absolute inset-6 rounded-[50%] border border-[#c39a56]/35" /><div className="absolute inset-[16%] rounded-[50%] border border-dashed border-[#c39a56]/25" />{kingdoms.map((kingdom, index) => { const angle = (index / kingdoms.length) * Math.PI * 2; return <button key={kingdom} onClick={() => setSelected(index)} className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 transition hover:scale-110 ${selected === index ? 'text-[#f1c878]' : 'text-[#bd9f68]'}`} style={{ left: `${50 + Math.cos(angle) * 35}%`, top: `${50 + Math.sin(angle) * 36}%` }}><span className={`flex h-8 w-6 items-center justify-center border ${selected === index ? 'border-[#edbb67] bg-[#7a1018] shadow-[0_0_18px_#b9512f]' : 'border-[#d6af70]/70 bg-[#17243a]'}`}><Map size={13} /></span><span className="cinzel whitespace-nowrap text-[7px] tracking-[.1em]">{kingdom}</span></button>; })}<div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center"><Castle className="mx-auto text-[#d9b367]" size={26} /><div className="cinzel mt-1 text-[9px] tracking-[.2em] text-[#d9b367]">THE GATE</div></div></Panel><Panel className="p-4 sm:p-5"><div className="cinzel text-[10px] tracking-[.28em] text-[#d3a65d]">KINGDOM / 0{selected + 1}</div><h3 className="mt-2 text-2xl text-[#eee0c2] sm:text-3xl">{kingdoms[selected]}</h3><div className="mt-4 space-y-2 text-sm text-[#bdb4a0]">{[['Environment', 'Ash valleys & broken snow'], ['Enemies', 'Demon hosts, bounty hunters'], ['Creatures', 'The Emberback'], ['Architecture', 'Fortified cathedrals'], ['Bosses', 'The Warden of Cinders'], ['Loot', 'Worldglass / rare relics']].map(([label, value]) => <div key={label} className="border-b border-white/10 pb-1"><span className="text-[#d3a65d]">{label}</span><span className="float-right text-right text-[#d1c9b9]">{value}</span></div>)}</div></Panel></div></div>; }

function Loot({ selected, setSelected }: { selected: number; setSelected: (value: number) => void }) { const item = items[selected]; return <div className="flex h-full flex-col"><SectionHeading eyebrow="ARMORY / PLAYER HISTORY" title="WHAT YOU FIND CHANGES YOU" text="Every relic has a history. Every history has a player." /><div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1fr_.8fr]"><Panel className="p-4 sm:p-5"><div className="mb-3 flex items-center justify-between"><span className="cinzel text-[10px] tracking-[.25em] text-[#d3a65d]">INVENTORY / 06 ITEMS</span><Package size={16} className="text-[#d3a65d]" /></div><div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{items.map((loot, index) => <button key={loot.name} onClick={() => setSelected(index)} className={`aspect-square border bg-[#111d2e] p-2 transition hover:-translate-y-0.5 ${selected === index ? 'border-[#e2b967] shadow-[inset_0_0_20px_rgba(206,155,65,.18)]' : 'border-white/10'}`}><Icon icon={loot.icon} size={24} /></button>)}</div><div className="mt-3 border-t border-white/10 pt-3"><div className={`cinzel text-xs tracking-[.2em] ${item.rarity === 'legendary' ? 'text-[#f1b44e]' : item.rarity === 'epic' ? 'text-[#d367cc]' : item.rarity === 'rare' ? 'text-[#62a7e9]' : 'text-[#aaa6a0]'}`}>{item.rarity.toUpperCase()}</div><h3 className="mt-1 text-xl text-[#eedfbd]">{item.name}</h3><p className="mt-1 text-sm text-[#bcb3a1]">{item.note}</p>{selected === 0 && <div className="mt-2 border-l border-[#c9a05a] bg-[#d1a85a]/5 p-2 text-xs leading-relaxed text-[#cbbd9f]">Discovered by: <strong className="text-[#ead19a]">JohnTheMan</strong> · Current owner: CrimsonBlade</div>}</div></Panel><div className="space-y-3"><Panel className="p-4 sm:p-5"><div className="cinzel text-[10px] tracking-[.22em] text-[#d3a65d]">BUILD / CRIMSONBLADE</div><div className="mt-3 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a05a] bg-[#7a1018]/40"><Shield size={22} /></div><div><h3 className="text-lg">Eternal Knight</h3><p className="text-xs text-[#a99f8b]">Level 38 · World 38</p></div></div><div className="mt-3 space-y-2">{[['Strength', 82], ['Resolve', 67], ['Luck', 49]].map(([name, value]) => <div key={name}><div className="mb-0.5 flex justify-between text-xs"><span>{name}</span><span className="text-[#d7ab61]">{value}</span></div><div className="h-1 bg-white/10"><div className="h-full bg-gradient-to-r from-[#8b2721] to-[#ddb365]" style={{ width: `${value}%` }} /></div></div>)}</div></Panel><Panel className="border-[#d0a254]/50 bg-[#4c2b0e]/35 p-4"><div className="flex gap-3"><Diamond className="shrink-0 text-[#e0b25f]" size={18} /><div><div className="cinzel text-[10px] tracking-[.2em] text-[#e0b25f]">OPTIONAL DIGITAL OWNERSHIP</div><p className="mt-1 text-xs leading-relaxed text-[#d4c3a3]">No crypto, NFT, or wallet needed. Ownership is an optional layer, not a paywall.</p></div></div></Panel></div></div></div>; }

function Eternal({ state, setState }: { state: 'idle' | 'fallen' | 'victory'; setState: (value: 'idle' | 'fallen' | 'victory') => void }) { return <div className="flex h-full flex-col"><SectionHeading eyebrow="PROFILE / ETERNAL LEVEL 38" title="DEATH IS NOT THE END" text="Level 1 is the first world conquered. There is no maximum. How far can you go?" /><div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[.9fr_1.1fr]"><Panel className="p-4 sm:p-6"><div className="flex items-start justify-between"><div><div className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">CRIMSONBLADE</div><h3 className="mt-1 text-2xl sm:text-3xl">Eternal Level 38</h3></div><Crown size={28} className="text-[#d7aa60]" /></div><div className="mt-5 grid grid-cols-3 gap-2">{[['#42', 'Season Rank'], ['38', 'Worlds Conquered'], ['17', 'Rare Discoveries']].map(([value, label]) => <div key={label} className="border border-white/10 bg-white/[.03] p-2 text-center"><div className="cinzel text-xl text-[#dfb467]">{value}</div><div className="mt-0.5 text-[10px] text-[#9e988a]">{label}</div></div>)}</div><div className="mt-5"><div className="mb-1 flex justify-between text-xs text-[#aaa08d]"><span>PROGRESSION TO WORLD 39</span><span>74%</span></div><div className="h-1.5 border border-[#b78646]/40 bg-[#101827] p-[2px]"><div className="h-full w-[74%] bg-gradient-to-r from-[#7b1b1f] via-[#d38b3c] to-[#efd07e]" /></div></div></Panel><Panel className="relative overflow-hidden p-4 sm:p-5"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(69,160,184,.3),transparent_42%),linear-gradient(135deg,#10283a,#08121f)]" /><div className="gate-pulse absolute left-1/2 top-1/2 h-36 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#65cce0]/70 bg-[#4cb6d4]/10" /><div className="relative flex h-full flex-col justify-between"><div className="cinzel text-[10px] tracking-[.25em] text-[#81d7df]">THE GATE / CHOOSE YOUR FATE</div><div className="mt-auto text-center"><h3 className="display-title text-xl">{state === 'fallen' ? 'YOU DIED' : state === 'victory' ? 'NEXT WORLD' : 'FALL IN BATTLE'}</h3><p className="mt-2 text-sm text-[#c0d6d4]">{state === 'fallen' ? 'Return to your level, progression intact.' : state === 'victory' ? 'The gateway opens somewhere impossible.' : 'Every ending is another beginning.'}</p><div className="mt-4 flex justify-center gap-3">{state === 'fallen' ? <Button onClick={() => setState('idle')} icon={<RotateCcw size={14} />}>RETRY</Button> : state === 'victory' ? <Button onClick={() => setState('idle')} variant="gold" icon={<ArrowRight size={14} />}>ENTER</Button> : <><Button onClick={() => setState('fallen')} variant="ghost" icon={<Swords size={14} />}>FALL IN BATTLE</Button><Button onClick={() => setState('victory')} variant="gold" icon={<Trophy size={14} />}>VICTORY</Button></>}</div></div></div></Panel></div></div>; }

function Compete() { const players = [['01', 'CinderSaint', 'World 112', '4,820'], ['02', 'CrimsonBlade', 'World 38', '3,914'], ['03', 'VeyraWolf', 'World 34', '3,761'], ['04', 'AshWalker', 'World 29', '3,204']]; return <div className="flex h-full flex-col"><SectionHeading eyebrow="SEASON 01 / THE FIRST GATE" title="PROVE YOUR LEGEND" text="Competition rewards achievement, not hours spent farming. Some events can offer cash prizes." /><div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1.1fr_.9fr]"><Panel className="overflow-hidden p-4 sm:p-5"><div className="mb-3 flex items-center justify-between"><span className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">ETERNAL LEADERBOARD</span><Trophy size={16} className="text-[#d5a45c]" /></div><div className="grid grid-cols-[40px_1fr_auto_auto] gap-3 border-b border-white/15 pb-2 text-[10px] tracking-[.14em] text-[#897f6d]"><span>#</span><span>PLAYER</span><span>WORLD</span><span>SCORE</span></div>{players.map(row => <div key={row[1]} className="grid grid-cols-[40px_1fr_auto_auto] items-center gap-3 border-b border-white/10 py-2.5 text-sm"><span className="cinzel text-[#d5a45c]">{row[0]}</span><span>{row[1]}</span><span className="text-[#9e9888]">{row[2]}</span><span className="text-[#dcb36c]">{row[3]}</span></div>)}</Panel><div className="grid gap-2 sm:grid-cols-2">{[['Boss Rushes', Flame], ['Dungeon Challenges', Castle], ['Survival Events', Heart], ['Speed Runs', Zap], ['Solo / Duo / Squad', Users], ['Community Events', Award]].map(([label, icon]) => <Panel key={label as string} className="flex items-center gap-3 p-3"><Icon icon={icon as React.ElementType} size={20} /><div><div className="cinzel text-[10px] tracking-[.14em] text-[#dfb66e]">{label as string}</div><p className="mt-0.5 text-xs text-[#928b7c]">Seasonal event</p></div></Panel>)}</div></div></div>; }

function PageDots({ active, onNavigate }: { active: Section; onNavigate: (section: Section) => void }) {
  const items: { id: Section; label: string }[] = [{ id: 'home', label: 'TITLE' }, ...tabs.map(tab => ({ id: tab.id as Section, label: tab.label })), { id: 'donate', label: 'DONATE' }, { id: 'demo', label: 'DEMO' }];
  return <nav className="pointer-events-none fixed bottom-16 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-2 sm:flex" aria-label="Section indicator"><div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[#b78a4a]/25 bg-[#080d17]/80 px-4 py-2 backdrop-blur-sm">{items.map(item => <button key={item.id} onClick={() => onNavigate(item.id)} aria-label={item.label} className={`h-2 rounded-full transition-all ${active === item.id ? 'w-6 bg-[#e2b967]' : 'w-2 bg-[#6b5d42] hover:bg-[#a8854e]'}`} />)}</div></nav>;
}

function Footer({ onNavigate }: { onNavigate: (section: Section) => void }) { return <footer className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center border-t border-[#b78a4a]/25 bg-[#080d17]/75 px-6 py-3 text-center text-[#8f897d] backdrop-blur-sm"><div className="flex items-center gap-6"><button onClick={() => onNavigate('home')} className="cinzel text-xs tracking-[.25em] text-[#d6b16b]">LIFE ETERNAL</button><div className="hidden text-xs text-[#898273] sm:block">Forever-free single-player & co-op action RPG.</div><div className="flex gap-4"><a href="#x" aria-label="X" className="transition hover:text-[#d6b16b]"><X size={17} /></a><a href="#discord" aria-label="Discord" className="transition hover:text-[#d6b16b]"><Users size={17} /></a><a href="#youtube" aria-label="YouTube" className="transition hover:text-[#d6b16b]"><Youtube size={17} /></a></div></div></footer>; }

export default App;


