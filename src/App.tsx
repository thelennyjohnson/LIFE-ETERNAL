import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Castle, Check, ChevronDown, ChevronRight, CircleHelp,
  Copy, Cpu, Crown, Crosshair, Diamond, Disc3, Dices, Download, ExternalLink, Flame, Gamepad2, Gem, Globe2, HardDrive, Hammer, Heart,
  LockKeyhole, Map, Menu, Monitor, Mountain, Music2, Package, Play, QrCode, RotateCcw, ScrollText, Share2, Shield,
  ShieldCheck, Swords, Trophy, Users, Volume2, VolumeX, X, Youtube, Zap
} from 'lucide-react';
import { assets } from './assets';

type Section = 'home' | 'story' | 'world' | 'loot' | 'eternal' | 'compete' | 'donate' | 'demo';

const tabs: { id: Exclude<Section, 'home' | 'donate'>; label: string }[] = [
  { id: 'story', label: 'STORY' }, { id: 'world', label: 'WORLD' }, { id: 'loot', label: 'LOOT' },
  { id: 'eternal', label: 'GAMEPLAY' }, { id: 'compete', label: 'COMPETE' },
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
  const [sound, setSound] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const navigationLockRef = useRef(false);
  const pageNavigationClickRef = useRef(false);

  const playSfx = () => {
    if (!sound) return;
    const sfx = new Audio('/sword-menu-sfx.mp3');
    sfx.volume = 0.5;
    void sfx.play().catch(() => undefined);
  };
  const startBackgroundMusic = () => {
    if (sound) void backgroundMusicRef.current?.play().catch(() => undefined);
  };
  const toggleSound = () => {
    const next = !sound;
    if (next) void backgroundMusicRef.current?.play().catch(() => undefined);
    else backgroundMusicRef.current?.pause();
    setSound(next);
  };
  useEffect(() => {
    const music = new Audio('/epic-intro-guitar.mp3');
    music.loop = true;
    music.volume = 0.28;
    backgroundMusicRef.current = music;
    return () => { music.pause(); backgroundMusicRef.current = null; };
  }, []);
  useEffect(() => {
    const music = backgroundMusicRef.current;
    if (!music) return;
    if (!sound) { music.pause(); return; }
    void music.play().catch(() => undefined);
  }, [sound]);
  useEffect(() => {
    if (!sound) return;
    const startMusic = () => startBackgroundMusic();
    window.addEventListener('pointerdown', startMusic, { capture: true, once: true });
    window.addEventListener('keydown', startMusic, { capture: true, once: true });
    window.addEventListener('touchstart', startMusic, { capture: true, once: true });
    return () => {
      window.removeEventListener('pointerdown', startMusic, true);
      window.removeEventListener('keydown', startMusic, true);
      window.removeEventListener('touchstart', startMusic, true);
    };
  }, [sound]);
  useEffect(() => {
    if (!sound) return;
    const playButtonSfx = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest('button');
      if (pageNavigationClickRef.current) { pageNavigationClickRef.current = false; return; }
      if (!button || button.closest('[aria-label="Game navigation"]') || button.getAttribute('aria-label') === 'Open menu') return;
      const sfx = new Audio('/button-sfx.mp3');
      sfx.volume = 0.42;
      void sfx.play().catch(() => undefined);
    };
    window.addEventListener('click', playButtonSfx);
    return () => window.removeEventListener('click', playButtonSfx);
  }, [sound]);

  const goTo = (section: Section) => {
    pageNavigationClickRef.current = true;
    window.setTimeout(() => { pageNavigationClickRef.current = false; }, 0);
    startBackgroundMusic();
    playSfx();
    setActive(section);
    setMenuOpen(false);
  };
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
      {active === 'home' ? <Home onNavigate={goTo} sound={sound} toggleSound={toggleSound} menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> : <GameSection active={active} onNavigate={goTo} selectedKingdom={selectedKingdom} setSelectedKingdom={setSelectedKingdom} lootItem={lootItem} setLootItem={setLootItem} deathState={deathState} setDeathState={setDeathState} menuOpen={menuOpen} setMenuOpen={setMenuOpen} sound={sound} toggleSound={toggleSound} />}
    </div>
    <Footer onNavigate={goTo} />
  </main>;
}

// Recipient wallet address for crypto donations
const CRYPTO_RECIPIENT_ADDRESS = '0x3a1e9e54f4d708e3acbdb2cfaa3ec94f34b9b02e';
// Web3 EIP-681 paylink protocol & MetaMask universal deep link
const CRYPTO_PAY_LINK_EIP681 = `ethereum:${CRYPTO_RECIPIENT_ADDRESS}`;
const CRYPTO_METAMASK_LINK = `https://metamask.app.link/send/${CRYPTO_RECIPIENT_ADDRESS}`;

// Google Sheets integration configuration:
// 1. Create a Google Apps Script Web App attached to your Google Sheet with a doPost(e) handler
// 2. Paste the published Web App URL below
const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyvsmuEeVdOWsNeagdZ0CFgMqiLruZaQrgOBot14M52myDKSeCOXQlqJ7NLpcI1UPMh/exec';

type WebsiteFormSubmission = {
  type: 'waitlist' | 'team';
  email: string;
  source: string;
  skills?: string;
  gameExperience?: string;
  portfolio?: string;
  socials?: string;
};

async function submitWebsiteFormToSheet(payload: WebsiteFormSubmission): Promise<void> {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    throw new Error('The Google Sheets endpoint is not configured.');
  }

  // Apps Script Web Apps do not expose a normal CORS response to this site.
  // text/plain avoids a CORS preflight; the response is intentionally opaque.
  await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify({ ...payload, website: '' }),
  });
}

interface DonationRecord {
  email: string;
  amount: number;
  champion: string;
  chain: string;
  recipientAddress: string;
  donorTxOrWallet?: string;
  timestamp: string;
}

async function sendDonationToGoogleSheets(record: DonationRecord) {
  // Always safely cache record in localStorage as guarantee
  try {
    const cached = JSON.parse(localStorage.getItem('life_eternal_donations') || '[]');
    cached.push(record);
    localStorage.setItem('life_eternal_donations', JSON.stringify(cached));
  } catch (err) {
    console.warn('Could not cache donation locally:', err);
  }

  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    console.info('[Google Sheets] Webhook URL not set yet. Supporter recorded locally:', record);
    return { success: true, localOnly: true };
  }

  try {
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', // standard for Google Apps Script Web Apps
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    return { success: true };
  } catch (error) {
    console.error('[Google Sheets] Failed to send supporter record:', error);
    return { success: false, error };
  }
}

function XIcon({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordIcon({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.45 1.03 2.62.13.17 1.78 2.71 4.3 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.19.21-.58.21-1.08.14-1.19-.06-.1-.22-.17-.47-.29" />
    </svg>
  );
}

function RedditIcon({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87s-7.004-2.176-7.004-4.87c0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 13.99c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

function InstagramIcon({ size = 15, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}


function SideNav({ active, onNavigate, menuOpen, setMenuOpen, sound, toggleSound }: { active: Section; onNavigate: (section: Section) => void; menuOpen: boolean; setMenuOpen: (value: boolean) => void; sound: boolean; toggleSound: () => void }) {
  return <><button className="fixed right-5 top-5 z-50 border border-[#d7ad64]/60 bg-[#0a1220]/90 p-3 text-[#e8c980] sm:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button><nav className={`${menuOpen ? 'flex' : 'hidden'} fixed inset-x-5 top-20 z-40 flex-col gap-1 sm:fixed sm:right-8 sm:top-28 sm:flex sm:w-40 sm:inset-x-auto`} aria-label="Game navigation">{tabs.map(tab => <button key={tab.id} aria-current={active === tab.id ? 'page' : undefined} onClick={() => onNavigate(tab.id)} className={`tab cinzel flex h-10 items-center justify-center border border-[#9b7135]/45 bg-[#e5cb99] px-5 text-[10px] font-bold tracking-[.25em] text-[#26170f] shadow-lg ${active === tab.id ? 'border-[#e9ba68]' : ''}`}>{tab.label}</button>)}{active !== 'home' && <><button onClick={() => onNavigate('donate')} className={`tab cinzel flex h-10 items-center justify-center border border-[#b7914f] bg-gradient-to-r from-[#d7ac5b] to-[#926126] px-5 text-[10px] font-bold tracking-[.2em] text-[#20150d] shadow-lg ${active === 'donate' ? 'brightness-125' : ''}`}>DONATE</button><button onClick={() => onNavigate('demo')} className="tab cinzel flex h-10 items-center justify-center border border-[#c99a51] bg-gradient-to-r from-[#8d2025] to-[#3b080d] px-5 text-[9px] font-bold tracking-[.1em] text-[#f4dfb1] shadow-lg">JOIN THE WAITLIST</button></>}{<button onClick={toggleSound} className="mx-auto mt-3 flex items-center gap-2 text-[9px] font-bold tracking-[.18em] text-[#8b6a35]" aria-label="Toggle atmospheric audio">{sound ? <Volume2 size={14} /> : <VolumeX size={14} />} {sound ? 'SOUND ON' : 'SOUND OFF'}</button>}</nav></>;
}

function Home({ onNavigate, sound, toggleSound, menuOpen, setMenuOpen }: { onNavigate: (section: Section) => void; sound: boolean; toggleSound: () => void; menuOpen: boolean; setMenuOpen: (value: boolean) => void }) {
  return <section className="game-frame relative overflow-hidden border-b border-[#bb8d4b]/30">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_35%,#8d765d_0%,#314654_27%,#111d2d_60%,#080d17_100%)]" />
    <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${assets.heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(.35) sepia(.25)' }} />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,#07101c_4%,transparent_63%),linear-gradient(0deg,#080d17_1%,transparent_42%)]" />
    <img src="/hero-animation.webp" alt="" aria-hidden="true" className="hero-loop pointer-events-none absolute right-0 z-10 select-none object-contain object-right-bottom" />
    {embers.map((ember, index) => <i key={index} className="ember" style={{ left: ember.left, bottom: '-10px', animationDelay: ember.delay, animationDuration: ember.duration, ['--drift' as string]: ember.drift }} />)}
    <SideNav active="home" onNavigate={onNavigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} sound={sound} toggleSound={toggleSound} />
    <div className="relative z-30 mx-auto flex h-full max-w-[1440px] flex-col justify-center px-7 sm:px-14 lg:px-20"><div className="max-w-xl"><div className="cinzel mb-4 flex items-center gap-3 text-[10px] tracking-[.38em] text-[#cf9c4d]"><span className="h-px w-12 bg-[#cf9c4d]" />A FOREVER-FREE ACTION RPG</div><img src="/life-eternal-logo.png" alt="Life Eternal" className="h-auto w-44 mix-blend-screen drop-shadow-[0_0_18px_rgba(218,160,70,.38)] sm:w-56 lg:w-72" /><div className="mt-6 max-w-md border-l-2 border-[#a67b40] pl-5"><h2 className="cinzel text-lg leading-snug tracking-[.18em] text-[#e0b86e] sm:text-xl">THE LAST KNIGHT.<br />AN ENDLESS WAR.</h2><p className="mt-3 text-base leading-relaxed text-[#dfd3ba]">The Demon King Malakar is building a gateway to conquer the multiverse. You are C'eleste, the last surviving knight of an ancient order. Die, grow stronger, and try again.</p></div><div className="mt-6 flex flex-wrap gap-3"><Button onClick={() => onNavigate('demo')} variant="red" icon={<ScrollText size={14} />}>JOIN THE WAITLIST</Button><Button onClick={() => onNavigate('donate')} variant="gold" icon={<Heart size={14} />}>DONATE</Button></div><div className="cinzel mt-4 flex items-center gap-4 text-[9px] tracking-[.2em] text-[#a99d87]"><span className="flex items-center gap-2"><Gamepad2 size={14} /> PC</span><span className="h-3 w-px bg-[#806844]" /><span>ANDROID</span><span className="h-3 w-px bg-[#806844]" /><span>iOS</span></div></div></div>
    <div className="scroll-hint absolute bottom-20 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 text-[10px] tracking-[.18em] text-[#9f967f] lg:flex"><ChevronDown size={14} /> SCROLL TO EXPLORE</div>
  </section>;
}

function HeroPanel() { return <Panel className="absolute bottom-10 right-8 z-30 hidden w-72 p-6 lg:block"><div className="cinzel mb-4 text-[10px] tracking-[.25em] text-[#d1a85e]">THE ETERNAL OATH</div>{[['Infinite Campaign', Globe2], ['Death Isn’t The End', RotateCcw], ['No Pay-to-Win', Shield]].map(([label, icon]) => <div key={label as string} className="flex items-center gap-4 border-t border-white/10 py-3 text-[#d2c8b4]"><Icon icon={icon as React.ElementType} size={20} /><span className="text-lg">{label as string}</span></div>)}</Panel>; }

function GameSection({ active, onNavigate, selectedKingdom, setSelectedKingdom, lootItem, setLootItem, deathState, setDeathState, menuOpen, setMenuOpen, sound, toggleSound }: { active: Exclude<Section, 'home'>; onNavigate: (section: Section) => void; selectedKingdom: number; setSelectedKingdom: (value: number) => void; lootItem: number; setLootItem: (value: number) => void; deathState: 'idle' | 'fallen' | 'victory'; setDeathState: (value: 'fallen' | 'victory' | 'idle') => void; menuOpen: boolean; setMenuOpen: (value: boolean) => void; sound: boolean; toggleSound: () => void }) {
  return <section className="game-frame bg-[radial-gradient(ellipse_at_top,#1c3040,#0c1423_55%,#080d17)]"><SideNav active={active} onNavigate={onNavigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} sound={sound} toggleSound={toggleSound} /><div className="relative z-30 mx-auto flex h-full min-h-0 max-w-[1600px] flex-col px-5 pt-10 pb-20 sm:px-10 sm:pt-12 sm:pb-20 lg:pr-48"><button onClick={() => onNavigate('home')} className="cinzel mb-3 flex shrink-0 items-center gap-2 text-[10px] tracking-[.22em] text-[#c6a05e] hover:text-white sm:mb-4"><ArrowLeft size={14} /> RETURN TO TITLE</button><div className="min-h-0 flex-1 overflow-hidden">{active === 'story' && <Story />}{active === 'world' && <World selected={selectedKingdom} setSelected={setSelectedKingdom} />}{active === 'loot' && <Loot selected={lootItem} setSelected={setLootItem} />}{active === 'eternal' && <Eternal state={deathState} setState={setDeathState} />}{active === 'compete' && <Compete />}{active === 'donate' && <Donate />}{active === 'demo' && <Waitlist />}</div></div></section>;
}

function CharacterArt({ character, large = false }: { character: typeof donationCharacters[number]; large?: boolean }) { return <div className={`character-art relative min-h-0 overflow-hidden ${large ? 'h-full' : 'h-28'} w-full`} style={{ backgroundImage: `url(${character.image}), radial-gradient(circle at 50% 30%, ${character.accent}66, transparent 30%), linear-gradient(135deg, #172438, #080c15 72%)` }}><div className="character-aura absolute left-1/2 top-[18%] h-20 w-20 -translate-x-1/2 rounded-full" style={{ backgroundColor: `${character.accent}33` }} /><div className="character-silhouette absolute bottom-0 left-1/2 h-[78%] w-[30%] -translate-x-1/2 rounded-t-[45%]" style={{ background: `linear-gradient(90deg, #070a11, ${character.accent}99 45%, #090c13 72%)`, boxShadow: `0 0 40px ${character.accent}33` }} /><div className="character-blade absolute bottom-[13%] left-[62%] h-[65%] w-1 rotate-[24deg]" style={{ backgroundColor: character.accent, boxShadow: `0 0 12px ${character.accent}` }} /><div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-transparent to-transparent" /></div>; }

function Donate() {
  const [selected, setSelected] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [step, setStep] = useState<'payment' | 'success'>('payment');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedChain, setSelectedChain] = useState<'ETH' | 'BASE' | 'POLYGON'>('ETH');
  const [copied, setCopied] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const character = donationCharacters[selected];
  const choose = (index: number) => { setSelected(index); };

  const handleOpenCheckout = () => {
    setStep('payment');
    setEmailError('');
    setCheckoutOpen(true);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CRYPTO_RECIPIENT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const validateEmail = (val: string) => {
    return Boolean(val && val.includes('@') && val.includes('.'));
  };

  const handleConfirmPayment = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setIsSubmitting(true);

    await sendDonationToGoogleSheets({
      email: email.trim(),
      amount: character.price,
      champion: character.name,
      chain: selectedChain,
      recipientAddress: CRYPTO_RECIPIENT_ADDRESS,
      timestamp: new Date().toISOString(),
    });

    setIsSubmitting(false);
    setStep('success');
  };

  const shareText = "Check out Life Eternal video game. #lifeeternalgame";
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://life-eternal.game';

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleInstagramShare = async () => {
    await handleCopyCaption();
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="donation-screen flex h-full min-h-0 flex-col">
      <SectionHeading
        eyebrow="THE OFFERING / SUPPORT THE ETERNAL WAR"
        title="CHOOSE YOUR LEGEND"
        text="Select a contribution and your champion. Every contribution helps keep Life Eternal forever-free."
      />
      <div className="mt-3 grid min-h-0 flex-1 gap-3 lg:grid-cols-[.75fr_1.25fr] lg:items-stretch">
        <Panel className="hidden min-h-0 flex-col overflow-hidden p-3 sm:p-4 lg:flex">
          <div className="mb-2 flex items-center justify-between">
            <span className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">SELECT AMOUNT</span>
            <span className="text-xs text-[#a89b85]">{donationCharacters.length} OPTIONS</span>
          </div>
          <div className="hidden grid-cols-2 gap-2 sm:grid-cols-4 lg:grid">
            {donationCharacters.map((entry, index) => (
              <button
                key={entry.price}
                onClick={() => choose(index)}
                aria-label={`Donate $${entry.price}`}
                className={`character-card flex min-h-16 items-center justify-center p-3 ${
                  selected === index ? 'character-card-selected' : ''
                }`}
              >
                <span className="cinzel text-xl tracking-[.12em] text-[#f1ce86]">
                  ${entry.price.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
          <div className="flex min-h-24 items-center justify-center text-center lg:hidden">
            <div>
              <div className="cinzel text-[10px] tracking-[.2em] text-[#d5a45c]">SWIPE OR USE THE ARROWS</div>
              <div className="mt-2 text-sm text-[#bdb4a0]">Choose your support level below</div>
            </div>
          </div>
          <div className="mt-auto hidden items-center gap-4 border-t border-[#d2ad64]/30 pt-4 lg:flex">
            <Button variant="gold" onClick={handleOpenCheckout} icon={<Heart size={14} fill="currentColor" />}>
              DONATE
            </Button>
            <div>
              <div className="cinzel text-[10px] tracking-[.18em] text-[#d5a45c]">YOUR CONTRIBUTION</div>
              <div className="cinzel mt-1 text-2xl text-[#f1ce86]">${character.price.toLocaleString()}</div>
            </div>
          </div>
        </Panel>

        <Panel className="preview-panel relative min-h-0 flex flex-col overflow-hidden p-3 sm:p-4">
          <div className="cinzel shrink-0 text-[10px] tracking-[.3em]" style={{ color: character.accent }}>
            SELECTED CHAMPION / ${character.price.toLocaleString()}
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <CharacterArt character={character} large />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#070c15] via-[#070c15dd] to-transparent px-4 pb-3 pt-16">
              <h3 className="display-title text-xl sm:text-2xl">{character.name}</h3>
              <p className="mt-1 text-base italic text-[#d2c6ad]">{character.title}</p>
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-[#d2ad64]/30 pt-3 lg:hidden">
            <button
              onClick={() => choose((selected - 1 + donationCharacters.length) % donationCharacters.length)}
              className="border border-[#b78a4a]/60 px-2 py-3 text-xs text-[#e5c47d]"
            >
              ← ${donationCharacters[(selected - 1 + donationCharacters.length) % donationCharacters.length].price.toLocaleString()}
            </button>
            <button
              onClick={handleOpenCheckout}
              className="border border-[#e2b967] bg-gradient-to-b from-[#d9ad5b] to-[#8e5e22] px-3 py-3 text-xs font-bold tracking-[.08em] text-[#1d130d]"
            >
              DONATE ${character.price.toLocaleString()}
            </button>
            <button
              onClick={() => choose((selected + 1) % donationCharacters.length)}
              className="border border-[#b78a4a]/60 px-2 py-3 text-xs text-[#e5c47d]"
            >
              ${donationCharacters[(selected + 1) % donationCharacters.length].price.toLocaleString()} →
            </button>
          </div>
        </Panel>
      </div>

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03060d]/85 p-3 sm:p-4 backdrop-blur-sm">
          <Panel className="w-full max-w-md bg-[#0a1220] p-4 sm:p-5 shadow-[0_0_50px_rgba(0,0,0,.9),0_0_30px_rgba(215,160,72,.15)]">
            <div className="flex items-center justify-between border-b border-[#c49b58]/30 pb-2.5">
              <div>
                <div className="cinzel text-[9px] tracking-[.25em] text-[#d5a45c]">
                  {step === 'payment' ? 'SACRED OFFERING' : 'OFFERING CONFIRMED'}
                </div>
                <h3 className="text-lg font-bold text-[#f0e5ce] sm:text-xl">
                  {step === 'payment' ? `Donate $${character.price.toLocaleString()} · ${character.name}` : 'Thank You, Champion'}
                </h3>
              </div>
              <button
                onClick={() => setCheckoutOpen(false)}
                aria-label="Close"
                className="text-[#c9a05a] transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {step === 'payment' ? (
              <div className="mt-3 space-y-3">
                {/* Required Email Field */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="cinzel block text-[10px] tracking-[.18em] text-[#d5a45c]">
                      EMAIL ADDRESS <span className="text-[#e26955]">*</span>
                    </label>
                    {emailError && <span className="text-[10px] text-[#e26955]">{emailError}</span>}
                  </div>
                  <input
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    type="email"
                    required
                    placeholder="you@example.com"
                    className={`mt-1 w-full border bg-[#060c17] px-3 py-2 font-sans text-xs text-[#f0e5ce] outline-none transition ${
                      emailError ? 'border-[#e26955]' : 'border-[#d2ad64]/40 focus:border-[#e2b967]'
                    }`}
                  />
                </div>

                {/* Accepted Chains (shown ONLY ONCE) */}
                <div>
                  <div className="cinzel mb-1 text-[9px] tracking-[.18em] text-[#d5a45c]">
                    ACCEPTED CHAINS
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['ETH', 'BASE', 'POLYGON'] as const).map((chain) => (
                      <button
                        key={chain}
                        type="button"
                        onClick={() => setSelectedChain(chain)}
                        className={`cinzel border py-1.5 text-center text-[10px] font-bold tracking-[.12em] transition ${
                          selectedChain === chain
                            ? 'border-[#e2b967] bg-[#d2a85d]/20 text-[#f3d289] shadow-[0_0_10px_rgba(226,185,103,.2)]'
                            : 'border-white/10 bg-white/[.02] text-[#b8ab94] hover:border-white/30'
                        }`}
                      >
                        {chain === 'ETH' ? 'ETH (Ethereum)' : chain === 'BASE' ? 'BASE Network' : 'POLYGON'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Send to Address & Copy */}
                <div className="border border-[#c49b58]/35 bg-[#08101d] p-2.5">
                  <div className="cinzel text-[9px] tracking-[.16em] text-[#d5a45c]">
                    SEND TO WALLET ADDRESS
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 select-all truncate border border-white/10 bg-[#040810] px-2.5 py-1.5 font-mono text-[11px] text-[#eedfbc]">
                      {CRYPTO_RECIPIENT_ADDRESS}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      className="cinzel flex shrink-0 items-center gap-1.5 border border-[#d2ad64]/60 bg-[#16253b] px-3 py-1.5 text-[9px] font-bold tracking-[.14em] text-[#f0dfb8] transition hover:border-[#e2b967] hover:bg-[#203450]"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-[#e1b25b]" /> COPIED
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> COPY
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Crypto Paylinks */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={CRYPTO_PAY_LINK_EIP681}
                    className="cinzel flex items-center justify-center gap-1.5 border border-[#c99a51] bg-gradient-to-b from-[#8d2025] to-[#3b080d] py-2 text-[10px] font-bold tracking-[.14em] text-[#f4dfb1] shadow transition hover:brightness-125"
                  >
                    <Zap size={13} /> PAY VIA WALLET
                  </a>
                  <a
                    href={CRYPTO_METAMASK_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cinzel flex items-center justify-center gap-1.5 border border-[#d2ad64]/60 bg-[#142337] py-2 text-[10px] font-bold tracking-[.14em] text-[#e8cf94] transition hover:border-[#e2b967] hover:bg-[#1b2f48]"
                  >
                    <ExternalLink size={13} /> METAMASK
                  </a>
                </div>

                {/* Confirm sent button */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmPayment}
                    className="cinzel flex w-full items-center justify-center gap-2 border border-[#e1bd75] bg-gradient-to-b from-[#d9ad5b] to-[#8e5e22] py-2.5 text-[11px] font-bold tracking-[.2em] text-[#1d130d] shadow transition hover:brightness-125 disabled:opacity-60"
                  >
                    <Check size={14} />
                    {isSubmitting ? 'RECORDING...' : "I'VE SENT PAYMENT"}
                  </button>
                </div>
              </div>
            ) : (
              /* Success View - clean, punchy, no extra clutter, fits perfectly */
              <div className="mt-3.5 space-y-3.5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#e2b967] bg-[#e2b967]/10 shadow-[0_0_20px_rgba(226,185,103,.2)]">
                  <Heart size={20} className="fill-[#e2b967] text-[#e2b967]" />
                </div>

                <div className="space-y-1">
                  <h4 className="cinzel text-base font-bold leading-snug text-[#f7e8c8] sm:text-lg">
                    "You've brought us one step closer to making this game a reality"
                  </h4>
                  <p className="text-xs text-[#cbbfa9]">
                    Thank you deeply for backing Life Eternal and keeping it forever-free.
                  </p>
                </div>

                {/* Social Share Buttons */}
                <div>
                  <div className="cinzel mb-1.5 text-[9px] tracking-[.18em] text-[#d5a45c]">
                    SHARE WITH FRIENDS
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 border border-white/15 bg-white/5 py-1.5 text-[10px] text-[#eee0c2] transition hover:border-[#e2b967] hover:bg-[#152336]"
                    >
                      <XIcon size={12} /> X
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 border border-white/15 bg-white/5 py-1.5 text-[10px] text-[#eee0c2] transition hover:border-[#25D366] hover:bg-[#152336]"
                    >
                      <WhatsAppIcon size={13} className="text-[#25D366]" /> WhatsApp
                    </a>
                    <a
                      href={`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 border border-white/15 bg-white/5 py-1.5 text-[10px] text-[#eee0c2] transition hover:border-[#FF4500] hover:bg-[#152336]"
                    >
                      <RedditIcon size={13} className="text-[#FF4500]" /> Reddit
                    </a>
                    <button
                      type="button"
                      onClick={handleInstagramShare}
                      className="flex items-center justify-center gap-1 border border-white/15 bg-white/5 py-1.5 text-[10px] text-[#eee0c2] transition hover:border-[#E1306C] hover:bg-[#152336]"
                    >
                      <InstagramIcon size={13} className="text-[#E1306C]" /> {captionCopied ? 'Copied' : 'Instagram'}
                    </button>
                  </div>
                </div>

                {/* Discord Community Button */}
                <div>
                  <a
                    href="https://discord.gg/s4hfgz2yy8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cinzel inline-flex w-full items-center justify-center gap-2 border border-[#5865F2] bg-[#5865F2]/20 py-2 text-[10px] font-bold tracking-[.14em] text-[#e8ebff] shadow transition hover:bg-[#5865F2] hover:text-white"
                  >
                    <DiscordIcon size={15} /> JOIN DISCORD COMMUNITY
                  </a>
                </div>

                {/* Close / Return */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(false)}
                    className="cinzel text-[10px] tracking-[.18em] text-[#8e8371] transition hover:text-white"
                  >
                    RETURN TO GAME
                  </button>
                </div>
              </div>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

function Demo() { return <div className="demo-screen flex h-full flex-col"><SectionHeading eyebrow="THE FIRST GATE / PC DEMO" title="ENTER THE ETERNAL WAR" text="Download the free PC demo and take your first step through the gateway. Your progress is yours to keep." /><div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1.1fr_.9fr]"><Panel className="p-4 sm:p-6"><div className="flex items-center justify-between border-b border-[#c49b58]/30 pb-3"><div><div className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">LIFE ETERNAL / PC DEMO</div><h3 className="mt-1 text-2xl text-[#ebdfc5]">Recommended</h3></div><Monitor className="text-[#d5a45c]" size={24} /></div><div className="mt-4 grid gap-2 sm:grid-cols-2"><Requirement icon={Cpu} label="Processor" value="Intel Core i5-8400 / AMD Ryzen 5 2600" /><Requirement icon={Monitor} label="Graphics" value="GTX 1060 6GB / RX 580 8GB" /><Requirement icon={HardDrive} label="Storage" value="35 GB available space" /><Requirement icon={ShieldCheck} label="Operating system" value="Windows 10 64-bit or newer" /></div><div className="mt-4 border border-[#d2a85d]/30 bg-[#d2a85d]/5 p-3"><p className="text-sm text-[#d0c4ac]">16 GB RAM · RTX 2060 / RX 6600 · Broadband internet connection</p></div></Panel><Panel className="relative flex flex-col justify-between overflow-hidden p-5 sm:p-6"><div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_32%,rgba(213,154,69,.25),transparent_24%),linear-gradient(135deg,#172b39,#090f1b)]" /><div className="absolute right-[16%] top-[12%] h-40 w-24 rounded-[50%] border border-[#d5a45c]/40 shadow-[0_0_45px_rgba(213,164,92,.18)]" /><div className="relative"><div className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">NO ACCOUNT REQUIRED</div><h3 className="mt-3 text-3xl text-[#eee0c2]">A forever-free beginning.</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-[#c9bea9]">Play the opening chapter solo or bring a friend. No pay-to-win systems. No time limit.</p></div><div className="relative flex flex-1 flex-col justify-center pt-3"><Button variant="red" onClick={() => alert('The Life Eternal PC demo installer will be available here soon.')} icon={<Download size={15} />}>DOWNLOAD PC DEMO</Button><p className="mt-2 text-xs text-[#928a7b]">Windows installer · 4.2 GB · Version 0.1.0</p></div></Panel></div><div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#a7a092]"><span className="flex items-center gap-1"><Check size={13} className="text-[#d4a75d]" /> Demo progress carries forward</span><span className="flex items-center gap-1"><Users size={13} className="text-[#d4a75d]" /> Solo and co-op ready</span><span className="flex items-center gap-1"><ShieldCheck size={13} className="text-[#d4a75d]" /> Safe, direct download</span></div></div>; }
function Requirement({ icon: Component, label, value }: { icon: React.ElementType; label: string; value: string }) { return <div className="border border-white/10 bg-white/[.03] p-3"><div className="flex items-center gap-2"><Component size={17} className="shrink-0 text-[#d4a75d]" /><div className="cinzel text-[10px] tracking-[.16em] text-[#d2a85e]">{label}</div></div><p className="mt-2 text-base leading-snug text-[#c7bca6]">{value}</p></div>; }

function Waitlist() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamSubmitted, setTeamSubmitted] = useState(false);
  const [teamEmail, setTeamEmail] = useState('');
  const [skills, setSkills] = useState('');
  const [gameExperience, setGameExperience] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [socials, setSocials] = useState('');
  const [waitlistError, setWaitlistError] = useState('');
  const [waitlistSending, setWaitlistSending] = useState(false);
  const [teamError, setTeamError] = useState('');
  const [teamSending, setTeamSending] = useState(false);

  const submitWaitlist = async () => {
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setWaitlistError('Enter a valid email address.');
      setJoined(false);
      return;
    }

    setWaitlistSending(true);
    setWaitlistError('');
    setJoined(false);
    try {
      await submitWebsiteFormToSheet({ type: 'waitlist', email: cleanEmail, source: 'Homepage waitlist' });
      setJoined(true);
    } catch {
      setWaitlistError('Could not send your signup. Please try again.');
    } finally {
      setWaitlistSending(false);
    }
  };

  const submitTeamApplication = async () => {
    const cleanEmail = teamEmail.trim();
    const cleanSkills = skills.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !cleanSkills) {
      setTeamError('Enter a valid email and describe the skills you can contribute.');
      setTeamSubmitted(false);
      return;
    }

    setTeamSending(true);
    setTeamError('');
    setTeamSubmitted(false);
    try {
      await submitWebsiteFormToSheet({
        type: 'team', email: cleanEmail, skills: cleanSkills,
        gameExperience: gameExperience.trim(), portfolio: portfolio.trim(), socials: socials.trim(),
        source: 'Join the Team form',
      });
      setTeamSubmitted(true);
    } catch {
      setTeamError('Could not send your application. Please try again.');
    } finally {
      setTeamSending(false);
    }
  };

  return <div className="flex h-full flex-col"><SectionHeading eyebrow="THE FIRST GATE / LAUNCH ACCESS" title="JOIN THE WAITLIST" text="Be among the first to hear when Life Eternal launches, along with development news and early opportunities to join the world." /><div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1.1fr_.9fr]"><Panel className="p-5 sm:p-6"><div className="flex items-center justify-between border-b border-[#c49b58]/30 pb-3"><div><div className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">LIFE ETERNAL / LAUNCH NEWS</div><h3 className="mt-1 text-2xl text-[#ebdfc5]">The first gate opens soon.</h3></div><ScrollText className="text-[#d5a45c]" size={24} /></div><p className="mt-5 max-w-lg text-sm leading-relaxed text-[#c9bea9] sm:text-base">Leave your email to receive launch announcements, development updates, and future playtest news.</p><label className="cinzel mt-5 block text-[10px] tracking-[.18em] text-[#d5a45c]">EMAIL ADDRESS<input value={email} onChange={event => { setEmail(event.target.value); setJoined(false); }} type="email" placeholder="you@example.com" className="mt-2 w-full border border-[#d2ad64]/45 bg-[#08111e] px-3 py-3 font-sans text-sm tracking-normal text-[#f0e5ce] outline-none focus:border-[#e2b967]" /></label><div className="mt-4"><Button variant="red" onClick={() => void submitWaitlist()} icon={<ScrollText size={15} />}>{waitlistSending ? 'SENDING…' : 'JOIN THE WAITLIST'}</Button>{waitlistError && <p className="mt-3 text-sm text-red-300">{waitlistError}</p>}{joined && <div role="status" aria-live="polite" className="mt-4 border border-emerald-400/50 bg-emerald-950/35 p-4 shadow-[0_0_24px_rgba(16,185,129,.12)]"><div className="flex items-start gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-300/60 bg-emerald-400/10"><Check size={17} className="text-emerald-300" /></span><div><h4 className="cinzel text-sm font-bold tracking-[.12em] text-emerald-100">You’re on the waitlist!</h4><p className="mt-1 text-sm leading-relaxed text-[#d8d0bb]">Your signup was received successfully. We’ll email you when the gate opens.</p></div></div><a href="https://discord.gg/s4hfgz2yy8" target="_blank" rel="noopener noreferrer" className="cinzel mt-4 flex w-full items-center justify-center gap-2 border border-[#5865F2]/80 bg-[#5865F2]/25 px-4 py-3 text-center text-[10px] font-bold tracking-[.15em] text-white transition hover:bg-[#5865F2] sm:w-auto"><DiscordIcon size={16} /> JOIN THE DISCORD COMMUNITY <ExternalLink size={13} /></a></div>}</div></Panel><Panel className="relative flex flex-col justify-between overflow-hidden p-5 sm:p-6"><div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_32%,rgba(213,154,69,.25),transparent_24%),linear-gradient(135deg,#172b39,#090f1b)]" /><div className="relative"><div className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">JOIN THE ETERNAL TEAM</div><h3 className="mt-3 text-3xl text-[#eee0c2]">Help build the next world.</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-[#c9bea9]">Artists, developers, community builders, writers, musicians, and passionate collaborators are welcome. Tell us what you can bring to Life Eternal.</p></div><div className="relative mt-6"><Button variant="gold" onClick={() => { setTeamOpen(true); setTeamSubmitted(false); }} icon={<Users size={15} />}>CONTRIBUTE TO THE GAME</Button></div></Panel></div>{teamOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03060d]/85 p-4 backdrop-blur-sm"><Panel className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[#0c1728] p-5 sm:p-6"><div className="flex items-start justify-between"><div><div className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">LIFE ETERNAL / CONTRIBUTOR FORM</div><h3 className="mt-2 text-2xl text-[#eee0c2]">Join the Eternal Team</h3></div><button onClick={() => setTeamOpen(false)} aria-label="Close contributor form" className="text-[#c9a05a] hover:text-white"><X size={20} /></button></div>{teamSubmitted ? <div className="mt-6 border border-[#d2ad64]/35 bg-[#d2ad64]/5 p-5 text-center"><Check size={28} className="mx-auto text-[#e1b25b]" /><h4 className="mt-3 text-xl text-[#eee0c2]">Application prepared</h4><p className="mt-2 text-sm leading-relaxed text-[#c9bea9]">Your application has been sent. Thank you for offering to help build Life Eternal.</p></div> : <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="cinzel text-[10px] tracking-[.16em] text-[#d5a45c]">EMAIL ADDRESS<input value={teamEmail} onChange={event => setTeamEmail(event.target.value)} type="email" placeholder="you@example.com" className="mt-2 w-full border border-white/15 bg-[#08111e] px-3 py-3 font-sans text-sm tracking-normal text-[#f0e5ce] outline-none focus:border-[#d9ac5f]" /></label><label className="cinzel text-[10px] tracking-[.16em] text-[#d5a45c]">GAME EXPERIENCE<input value={gameExperience} onChange={event => setGameExperience(event.target.value)} placeholder="Have you worked on a game before?" className="mt-2 w-full border border-white/15 bg-[#08111e] px-3 py-3 font-sans text-sm tracking-normal text-[#f0e5ce] outline-none focus:border-[#d9ac5f]" /></label><label className="cinzel sm:col-span-2 text-[10px] tracking-[.16em] text-[#d5a45c]">SKILLS OR CONTRIBUTIONS<textarea value={skills} onChange={event => setSkills(event.target.value)} placeholder="What skills can you contribute?" className="mt-2 min-h-24 w-full border border-white/15 bg-[#08111e] px-3 py-3 font-sans text-sm tracking-normal text-[#f0e5ce] outline-none focus:border-[#d9ac5f]" /></label><label className="cinzel text-[10px] tracking-[.16em] text-[#d5a45c]">PORTFOLIO LINKS<input value={portfolio} onChange={event => setPortfolio(event.target.value)} placeholder="Website, ArtStation, GitHub, etc." className="mt-2 w-full border border-white/15 bg-[#08111e] px-3 py-3 font-sans text-sm tracking-normal text-[#f0e5ce] outline-none focus:border-[#d9ac5f]" /></label><label className="cinzel text-[10px] tracking-[.16em] text-[#d5a45c]">SOCIAL MEDIA<input value={socials} onChange={event => setSocials(event.target.value)} placeholder="Discord, X, LinkedIn, etc." className="mt-2 w-full border border-white/15 bg-[#08111e] px-3 py-3 font-sans text-sm tracking-normal text-[#f0e5ce] outline-none focus:border-[#d9ac5f]" /></label><div className="sm:col-span-2"><Button variant="gold" onClick={() => void submitTeamApplication()} icon={<Check size={15} />}>{teamSending ? 'SENDING…' : 'SEND APPLICATION'}</Button>{teamError && <p className="mt-3 text-sm text-red-300">{teamError}</p>}</div></div>}</Panel></div>}</div>;
}

function Story() {
  return <div className="flex h-full flex-col"><SectionHeading eyebrow="QUEST JOURNAL / ENTRY 01" title="THE LAST ORDER" text="Memories return in fragments. Every world holds a piece of the truth." /><div className="mt-4 grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.25fr_.75fr]"><Panel className="min-h-0 overflow-hidden p-4 sm:p-6"><div className="mb-3 flex items-center justify-between border-b border-[#c49b58]/30 pb-3"><span className="cinzel text-xs tracking-[.25em] text-[#d5a45c]">CHRONICLE OF C’ELESTE</span><BookOpen size={16} className="text-[#c9a05a]" /></div><div className="space-y-4 text-base leading-relaxed text-[#c8bfad] sm:text-lg"><p>The Demon King Malakar has opened a gateway between worlds. You are C’eleste, the last surviving knight of an ancient order sworn to destroy him. Five years after being left for dead, you awaken to a world consumed by mutants, alien forces, enslaved kingdoms, and a war that has become something far greater than anyone imagined.</p><p>Malakar isn't trying to conquer one kingdom. He wants to conquer the multiverse.<br />And only you can stop him.</p></div></Panel><Panel className="flex flex-col justify-between overflow-hidden p-4 sm:p-5"><div><div className="mb-3 flex items-center gap-3 text-[#d55f45]"><Flame size={16} /><span className="cinzel text-[10px] tracking-[.25em]">TARGET / DEMON KING</span></div><h3 className="display-title text-xl">MALAKAR</h3><div className="mt-3 overflow-hidden border border-[#e1b25b]/80 bg-[#4b2c0e] p-1 shadow-[0_0_20px_rgba(215,160,72,.28),inset_0_0_0_1px_rgba(255,231,162,.32)]"><img src="/malakar.webp" alt="Malakar, the Demon King" className="aspect-square w-full object-cover" /></div></div><div className="mt-4 border-t border-[#bd8e4e]/30 pt-2 text-xs text-[#a99b84]">THREAT LEVEL <span className="float-right text-[#d95b3d]">ETERNAL</span></div></Panel></div></div>;
}

function World({ selected, setSelected }: { selected: number; setSelected: (value: number) => void }) { return <div className="flex h-full flex-col"><SectionHeading eyebrow="ATLAS / 12 KINGDOMS" title="A WORLD AT WAR" text="The gateway does not lead to one world. It leads to all of them. Choose a banner to read its trace." /><div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1.3fr_.7fr]"><Panel className="relative overflow-hidden p-4"><div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,#56706b,#172b38_42%,#0b1422_74%)]" /><div className="absolute inset-6 rounded-[50%] border border-[#c39a56]/35" /><div className="absolute inset-[16%] rounded-[50%] border border-dashed border-[#c39a56]/25" />{kingdoms.map((kingdom, index) => { const angle = (index / kingdoms.length) * Math.PI * 2; return <button key={kingdom} onClick={() => setSelected(index)} className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 transition hover:scale-110 ${selected === index ? 'text-[#f1c878]' : 'text-[#bd9f68]'}`} style={{ left: `${50 + Math.cos(angle) * 35}%`, top: `${50 + Math.sin(angle) * 36}%` }}><span className={`flex h-8 w-6 items-center justify-center border ${selected === index ? 'border-[#edbb67] bg-[#7a1018] shadow-[0_0_18px_#b9512f]' : 'border-[#d6af70]/70 bg-[#17243a]'}`}><Map size={13} /></span><span className="cinzel whitespace-nowrap text-[7px] tracking-[.1em]">{kingdom}</span></button>; })}<div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center"><Castle className="mx-auto text-[#d9b367]" size={26} /><div className="cinzel mt-1 text-[9px] tracking-[.2em] text-[#d9b367]">THE GATE</div></div></Panel><Panel className="p-4 sm:p-5"><div className="cinzel text-[10px] tracking-[.28em] text-[#d3a65d]">KINGDOM / 0{selected + 1}</div><h3 className="mt-2 text-2xl text-[#eee0c2] sm:text-3xl">{kingdoms[selected]}</h3><div className="mt-4 space-y-2 text-sm text-[#bdb4a0]">{[['Environment', 'Ash valleys & broken snow'], ['Enemies', 'Demon hosts, bounty hunters'], ['Creatures', 'The Emberback'], ['Architecture', 'Fortified cathedrals'], ['Bosses', 'The Warden of Cinders'], ['Loot', 'Worldglass / rare relics']].map(([label, value]) => <div key={label} className="border-b border-white/10 pb-1"><span className="text-[#d3a65d]">{label}</span><span className="float-right text-right text-[#d1c9b9]">{value}</span></div>)}</div></Panel></div></div>; }

function Loot({ selected, setSelected }: { selected: number; setSelected: (value: number) => void }) {
  const item = items[selected];
  return <div className="flex h-full flex-col"><SectionHeading eyebrow="ARMORY / PLAYER HISTORY" title="STARTING WITH THE OG LOOT FAM" text="Every relic has a history. Every history has a player." /><div className="mt-4 grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.2fr_.8fr]"><Panel className="min-h-0 overflow-hidden p-4 sm:p-5"><div className="mb-3 flex items-center justify-between"><span className="cinzel text-[10px] tracking-[.25em] text-[#d3a65d]">INVENTORY / 06 ITEMS</span><Package size={16} className="text-[#d3a65d]" /></div><div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{items.map((loot, index) => <button key={loot.name} onClick={() => setSelected(index)} aria-label={`Select ${loot.name}`} className={`aspect-square border bg-[#111d2e] p-2 transition hover:-translate-y-0.5 ${selected === index ? 'border-[#e2b967] shadow-[inset_0_0_20px_rgba(206,155,65,.18)]' : 'border-white/10'}`}><Icon icon={loot.icon} size={24} /></button>)}</div><div className="mt-3 border-t border-white/10 pt-3"><div className={`cinzel text-xs tracking-[.2em] ${item.rarity === 'legendary' ? 'text-[#f1b44e]' : item.rarity === 'epic' ? 'text-[#d367cc]' : item.rarity === 'rare' ? 'text-[#62a7e9]' : 'text-[#aaa6a0]'}`}>{item.rarity.toUpperCase()}</div><h3 className="mt-1 text-xl text-[#eedfbd]">{item.name}</h3><p className="mt-1 text-sm text-[#bcb3a1]">{item.note}</p></div><div className="mt-3 border-l border-[#c9a05a] bg-[#d1a85a]/5 p-3 text-sm leading-relaxed text-[#d8c7a7]">Loot grants no special ability, but it looks awesome.</div><div className="mt-3 border border-[#d0a254]/50 bg-[#4c2b0e]/35 p-3"><div className="flex gap-3"><Diamond className="shrink-0 text-[#e0b25f]" size={18} /><div><div className="cinzel text-[10px] tracking-[.2em] text-[#e0b25f]">OPTIONAL DIGITAL OWNERSHIP</div><p className="mt-1 text-xs leading-relaxed text-[#d4c3a3]">No crypto, NFT, or wallet needed. Ownership is an optional layer, not a paywall.</p></div></div></div></Panel><Panel className="preview-panel relative flex min-h-0 flex-col items-center justify-center overflow-hidden p-5 sm:p-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(213,154,69,.24),transparent_38%),linear-gradient(135deg,#172b39,#090f1b)]" /><div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-[#d5a45c]/35 bg-[#0b1422]/70 shadow-[0_0_55px_rgba(213,164,92,.18)] sm:h-64 sm:w-64"><Icon icon={item.icon} size={96} /></div><div className="relative mt-6 text-center"><div className="cinzel text-[10px] tracking-[.28em] text-[#d3a65d]">SELECTED RELIC</div><h3 className="display-title mt-2 text-xl sm:text-2xl">{item.name}</h3></div></Panel></div></div>;
}
function Eternal({ state, setState }: { state: 'idle' | 'fallen' | 'victory'; setState: (value: 'idle' | 'fallen' | 'victory') => void }) { return <div className="flex h-full flex-col"><SectionHeading eyebrow="GAMEPLAY / ETERNAL LEVEL 38" title="DEATH IS NOT THE END" text="Level 1 is the first world conquered. There is no maximum. How far can you go?" /><div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[.9fr_1.1fr]"><Panel className="p-4 sm:p-6"><div className="flex items-start justify-between"><div><div className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">@CRIMSONBLADE</div><h3 className="mt-1 text-2xl sm:text-3xl">Eternal Level 38</h3></div><Crown size={28} className="text-[#d7aa60]" /></div><div className="mt-5 grid grid-cols-3 gap-2">{[['#42', 'Season Rank'], ['38', 'Worlds Conquered'], ['17', 'Rare Discoveries']].map(([value, label]) => <div key={label} className="border border-white/10 bg-white/[.03] p-2 text-center"><div className="cinzel text-xl text-[#dfb467]">{value}</div><div className="mt-0.5 text-[10px] text-[#9e988a]">{label}</div></div>)}</div><div className="mt-5"><div className="mb-1 flex justify-between text-xs text-[#aaa08d]"><span>PROGRESSION TO WORLD 39</span><span>74%</span></div><div className="h-1.5 border border-[#b78646]/40 bg-[#101827] p-[2px]"><div className="h-full w-[74%] bg-gradient-to-r from-[#7b1b1f] via-[#d38b3c] to-[#efd07e]" /></div></div><div className="mt-4 grid grid-cols-3 gap-2"><div className="border border-[#d2a85d]/35 bg-[#d2a85d]/5 p-2 text-center"><Swords size={16} className="mx-auto text-[#dcb36c]" /><div className="cinzel mt-1 text-[9px] tracking-[.12em] text-[#dcb36c]">SOLO</div></div><div className="border border-[#d2a85d]/35 bg-[#d2a85d]/5 p-2 text-center"><Users size={16} className="mx-auto text-[#dcb36c]" /><div className="cinzel mt-1 text-[9px] tracking-[.12em] text-[#dcb36c]">CO-OP</div></div><div className="border border-[#d2a85d]/35 bg-[#d2a85d]/5 p-2 text-center"><Globe2 size={16} className="mx-auto text-[#dcb36c]" /><div className="cinzel mt-1 text-[9px] tracking-[.12em] text-[#dcb36c]">ENDLESS WORLDS</div></div></div></Panel><Panel className="relative overflow-hidden p-4 sm:p-5"><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(69,160,184,.3),transparent_42%),linear-gradient(135deg,#10283a,#08121f)]" /><div className="gate-pulse absolute left-1/2 top-1/2 h-36 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[#65cce0]/70 bg-[#4cb6d4]/10" /><div className="relative flex h-full flex-col justify-between"><div className="cinzel text-[10px] tracking-[.25em] text-[#81d7df]">THE GATE / CHOOSE YOUR FATE</div><div className="mt-auto text-center"><h3 className="display-title text-xl">{state === 'fallen' ? 'YOU DIED' : state === 'victory' ? 'NEXT WORLD' : 'FALL IN BATTLE'}</h3><p className="mt-2 text-sm text-[#c0d6d4]">{state === 'fallen' ? 'Return to your level, progression intact.' : state === 'victory' ? 'The gateway opens somewhere impossible.' : 'Every ending is another beginning.'}</p><div className="mt-4 flex justify-center gap-3">{state === 'fallen' ? <Button onClick={() => setState('idle')} icon={<RotateCcw size={14} />}>RETRY</Button> : state === 'victory' ? <Button onClick={() => setState('idle')} variant="gold" icon={<ArrowRight size={14} />}>ENTER</Button> : <><Button onClick={() => setState('fallen')} variant="ghost" icon={<Swords size={14} />}>FALL IN BATTLE</Button><Button onClick={() => setState('victory')} variant="gold" icon={<Trophy size={14} />}>VICTORY</Button></>}</div></div></div></Panel></div></div>; }

function Compete() { const players = [['01', 'CinderSaint', 'World 112', '4,820'], ['02', 'CrimsonBlade', 'World 38', '3,914'], ['03', 'VeyraWolf', 'World 34', '3,761'], ['04', 'AshWalker', 'World 29', '3,204']]; return <div className="flex h-full flex-col"><SectionHeading eyebrow="SEASON 01 / THE FIRST GATE" title="PROVE YOUR LEGEND" text="Competition rewards achievement, not hours spent farming. Some events can offer cash prizes." /><div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1.1fr_.9fr]"><Panel className="overflow-hidden p-4 sm:p-5"><div className="mb-3 flex items-center justify-between"><span className="cinzel text-[10px] tracking-[.25em] text-[#d5a45c]">ETERNAL LEADERBOARD</span><Trophy size={16} className="text-[#d5a45c]" /></div><div className="grid grid-cols-[40px_1fr_auto_auto] gap-3 border-b border-white/15 pb-2 text-[10px] tracking-[.14em] text-[#897f6d]"><span>#</span><span>PLAYER</span><span>WORLD</span><span>SCORE</span></div>{players.map(row => <div key={row[1]} className="grid grid-cols-[40px_1fr_auto_auto] items-center gap-3 border-b border-white/10 py-2.5 text-sm"><span className="cinzel text-[#d5a45c]">{row[0]}</span><span>{row[1]}</span><span className="text-[#9e9888]">{row[2]}</span><span className="text-[#dcb36c]">{row[3]}</span></div>)}</Panel><div className="grid gap-2 sm:grid-cols-2">{[['Boss Rushes', Flame], ['Dungeon Challenges', Castle], ['Survival Events', Heart], ['Speed Runs', Zap], ['Solo / Duo / Squad', Users], ['Community Events', Award]].map(([label, icon]) => <Panel key={label as string} className="flex items-center gap-3 p-3"><Icon icon={icon as React.ElementType} size={20} /><div><div className="cinzel text-[10px] tracking-[.14em] text-[#dfb66e]">{label as string}</div><p className="mt-0.5 text-xs text-[#928b7c]">Seasonal event</p></div></Panel>)}</div></div></div>; }

function PageDots({ active, onNavigate }: { active: Section; onNavigate: (section: Section) => void }) {
  const items: { id: Section; label: string }[] = [{ id: 'home', label: 'TITLE' }, ...tabs.map(tab => ({ id: tab.id as Section, label: tab.label })), { id: 'donate', label: 'DONATE' }, { id: 'demo', label: 'DEMO' }];
  return <nav className="pointer-events-none fixed bottom-16 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-2 sm:flex" aria-label="Section indicator"><div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[#b78a4a]/25 bg-[#080d17]/80 px-4 py-2 backdrop-blur-sm">{items.map(item => <button key={item.id} onClick={() => onNavigate(item.id)} aria-label={item.label} className={`h-2 rounded-full transition-all ${active === item.id ? 'w-6 bg-[#e2b967]' : 'w-2 bg-[#6b5d42] hover:bg-[#a8854e]'}`} />)}</div></nav>;
}

function Footer({ onNavigate }: { onNavigate: (section: Section) => void }) { return <footer className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center border-t border-[#b78a4a]/25 bg-[#080d17]/75 px-6 py-3 text-center text-[#8f897d] backdrop-blur-sm"><div className="flex items-center gap-6"><button onClick={() => onNavigate('home')} className="cinzel text-xs tracking-[.25em] text-[#d6b16b]">LIFE ETERNAL</button><div className="hidden text-xs text-[#898273] sm:block">Forever-free single-player & co-op action RPG.</div><div className="flex gap-4"><a href="https://twitter.com/intent/tweet?text=Check%20out%20Life%20Eternal%20video%20game.%20%23lifeeternalgame" target="_blank" rel="noopener noreferrer" aria-label="X" className="transition hover:text-[#d6b16b]"><XIcon size={16} /></a><a href="https://discord.gg/s4hfgz2yy8" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="transition hover:text-[#d6b16b]"><DiscordIcon size={17} /></a><a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition hover:text-[#d6b16b]"><Youtube size={17} /></a></div></div></footer>; }

export default App;


