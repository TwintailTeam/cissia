import { useState } from "react";
import { Badge, Banner, Button, Card, ContextMenu, DialogOverlay, Dropdown, type DropdownVariant, EmptyState, SpeedGraph, StatTile, StorageBar, BarsIcon, LoaderIcon, UploadIcon, WarningIcon, CheckIcon, ImageIcon, ChevronUpIcon, ChevronDownIcon, CloseIcon, SpinnerIcon, CalendarIcon, WineIcon, ClockIcon, DownloadCloudIcon, DownloadIcon, FolderIcon, FolderOpenIcon, HeartIcon, InfoIcon, PlayIcon, PlusCircleIcon, ServerIcon, SettingsIcon, SlidersIcon, TerminalIcon, TrashIcon, WrenchIcon, IconTile, InfoOverlay, ListRow, PageHeader, PageOverlay, Panel, PopupOverlay, ProgressBar, SteamIcon, formatPlaytime, formatLastPlayed, Input, SidebarItem, Tabs, type Tab, MediaControls, PathInput, Section, Select, Toggle, Tooltip, type ButtonSize, type ButtonTone, type ButtonVariant, type DialogType } from "cissia";

const ALL_TONES: ButtonTone[] = ["normal", "accent", "info", "success", "warning", "caution", "danger", "muted", "soft", "deep", "dim", "discord", "gloss", "pink", "emerald"];

const BUTTON_VARIANTS: { variant: ButtonVariant, size: ButtonSize }[] = [
    { variant: "action", size: "md" },
    { variant: "icon", size: "sm" },
    { variant: "icon", size: "md" },
    { variant: "round", size: "sm" },
    { variant: "round", size: "md" },
    { variant: "surface", size: "md" },
    { variant: "surface", size: "sm" },
    { variant: "tile", size: "md" },
    { variant: "chip", size: "sm" },
    { variant: "chip", size: "md" },
    { variant: "small", size: "md" },
    { variant: "block", size: "md" },
    { variant: "outline", size: "md" },
    { variant: "ghost", size: "md" },
    { variant: "link", size: "md" },
    { variant: "browse", size: "md" },
];

const DROPDOWN_VARIANTS: { variant: DropdownVariant, size: ButtonSize }[] = [
    { variant: "chip", size: "sm" },
    { variant: "chip", size: "md" },
    { variant: "action", size: "md" },
    { variant: "surface", size: "sm" },
    { variant: "tile", size: "md" },
    { variant: "small", size: "md" },
    { variant: "block", size: "md" },
    { variant: "outline", size: "md" },
    { variant: "ghost", size: "md" },
    { variant: "link", size: "md" },
    { variant: "browse", size: "md" },
    { variant: "icon", size: "md" },
    { variant: "round", size: "md" },
];



const DIALOG_TYPES: DialogType[] = ["error", "warning", "info", "confirm"];

const TAB_ICONS = [SlidersIcon, DownloadIcon, FolderIcon, TerminalIcon, InfoIcon, SettingsIcon, WineIcon, ServerIcon, WrenchIcon, HeartIcon, CalendarIcon, ClockIcon, TrashIcon, PlusCircleIcon, FolderOpenIcon];

const TABS: Tab[] = ALL_TONES.map((tone, index) => ({
    id: tone,
    label: tone,
    icon: TAB_ICONS[index]!,
    color: tone,
}));

const TILES = [
    { id: "hk4e_global", name: "Genshin Impact", icon: "https://picsum.photos/seed/hk4e/128/128" },
    { id: "hkrpg_global", name: "Honkai: Star Rail", icon: "https://picsum.photos/seed/hkrpg/128/128" },
    { id: "nap_global", name: "Zenless Zone Zero", icon: "https://picsum.photos/seed/nap/128/128" },
];

const QUEUE = [
    { id: "j1", name: "Genshin Impact", kind: "Update", icon: "https://picsum.photos/seed/hk4e/128/128" },
    { id: "j2", name: "Honkai: Star Rail", kind: "Game", icon: "https://picsum.photos/seed/hkrpg/128/128" },
    { id: "j3", name: "GE-Proton9-27", kind: "Runner" },
    { id: "j4", name: "Zenless Zone Zero", kind: "Game", icon: "https://picsum.photos/seed/nap/128/128" },
];



const BANNER_ICON: Record<string, string> = {
    normal: "text-zinc-900", accent: "text-purple-900", info: "text-blue-900", success: "text-green-900",
    warning: "text-amber-900", caution: "text-yellow-900", danger: "text-red-900", muted: "text-gray-900",
    soft: "text-white", deep: "text-zinc-100", dim: "text-white", discord: "text-white",
    gloss: "text-blue-950", pink: "text-pink-900", emerald: "text-emerald-900",
};

const GRAPH_SLOTS = 60;

const SPEED = Array.from({ length: GRAPH_SLOTS }, (_, i) => ({
    net: (6 + Math.sin(i / 4) * 4 + Math.sin(i / 1.7) * 1.5) * 1000 * 1000,
    disk: (3 + Math.sin(i / 6 + 1) * 2.5) * 1000 * 1000,
}));

const VERSIONS = [
    { value: "5.3.0", name: "5.3.0 (Latest)" },
    { value: "5.2.0", name: "5.2.0" },
    { value: "5.1.0", name: "5.1.0" },
];

const MEDIA = [
    { src: "https://picsum.photos/seed/liyue/1600/900", label: "Liyue", isDynamic: false },
    { src: "https://picsum.photos/seed/penacony/1600/900", label: "Penacony", isDynamic: false },
];

export function Preview() {
    const [toggle, setToggle] = useState(true);
    const [text, setText] = useState("some value");
    const [path, setPath] = useState("/home/user/Games");
    const [choice, setChoice] = useState("b");
    const [dialog, setDialog] = useState<DialogType | null>(null);
    const [media, setMedia] = useState(MEDIA[0]!.src);
    const [manifests, setManifests] = useState(false);
    const [page, setPage] = useState("");
    const [tab, setTab] = useState("normal");
    const [drag, setDrag] = useState<number | null>(null);
    const [dropAt, setDropAt] = useState<number | null>(null);
    const [menu, setMenu] = useState<{ x: number, y: number } | null>(null);
    const [queue, setQueue] = useState(QUEUE);
    const [dragId, setDragId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);
    const [panel, setPanel] = useState<"hero" | "plain" | "popup" | null>(null);
    const [pageOpen, setPageOpen] = useState(false);
    const [version, setVersion] = useState(VERSIONS[0]!.value);
    const [panelTone, setPanelTone] = useState<ButtonTone>("deep");

    const moveTo = (id: string, to: number) => setQueue((list) => {
        const from = list.findIndex((job) => job.id === id);
        if (from === -1 || to < 0 || to >= list.length) return list;
        const next = list.slice();
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item!);
        return next;
    });

    return (
        <div className="min-h-screen text-white p-8 flex flex-col gap-10">
            <h1 className="text-2xl font-bold">cissia</h1>

            <Section title="Button">
                <div className="flex flex-col gap-3">
                    {BUTTON_VARIANTS.map(({ variant, size }) => (
                        <div key={`${variant}-${size}`} className="flex items-center gap-3 flex-wrap">
                            <span className="w-36 shrink-0 text-xs text-zinc-500 font-mono">{variant} · {size}</span>
                            {ALL_TONES.map(tone => (
                                <Button key={tone} variant={variant} size={size} tone={tone}>{tone}</Button>
                            ))}
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Button · hero">
                <div className="flex flex-wrap gap-3">
                    {ALL_TONES.map(tone => (
                        <div key={tone} className="flex flex-col items-center gap-1">
                            <Button variant="hero" tone={tone} shimmer>
                                <PlayIcon className="w-5 h-5 md:w-6 md:h-6 text-white/90 ml-1" fill="currentColor" />
                                <span className="font-semibold text-lg md:text-xl text-white tracking-wide">{tone}</span>
                            </Button>
                            {tone === "info" && (
                                <Button variant="overlayChip" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                                    <FolderOpenIcon className="w-3.5 h-3.5" />
                                    <span className="uppercase tracking-wider group-hover:underline underline-offset-2">Use existing install</span>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Button · overlayChip">
                <div className="flex flex-wrap gap-3">
                    {ALL_TONES.map(tone => (
                        <Button key={tone} variant="overlayChip" tone={tone} style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                            <FolderOpenIcon className="w-3.5 h-3.5" />
                            <span className="uppercase tracking-wider group-hover:underline underline-offset-2">{tone}</span>
                        </Button>
                    ))}
                </div>
            </Section>

            <Section title="Banner">
                <div className="relative h-16">
                    <Banner tone="warning" icon={<WarningIcon className="w-4 h-4 text-amber-900" />}
                        action={<Button variant="small" tone="warning">Retry</Button>}>
                        Offline mode — downloads unavailable
                    </Banner>
                </div>
                <div className="relative h-16">
                    <Banner tone="warning" icon={<LoaderIcon className="w-4 h-4 text-amber-900 animate-spin" />} progress={45}>
                        Loading images (9/20)
                    </Banner>
                </div>
                <div className="relative h-16">
                    <Banner tone="warning" icon={<CheckIcon className="w-4 h-4 text-green-700" />}>
                        Connected
                    </Banner>
                </div>
                <div className="relative h-16">
                    <Banner variant="solid" tone="accent" icon={<UploadIcon className="w-4 h-4 text-white shrink-0" />}>
                        A new version of the launcher is available
                    </Banner>
                </div>
                {ALL_TONES.map(tone => (
                    <div key={tone} className="flex items-center gap-3">
                        <span className="w-36 shrink-0 text-xs text-zinc-500 font-mono">{tone}</span>
                        <div className="relative flex-1 h-14">
                            <Banner tone={tone} icon={<WarningIcon className={`w-4 h-4 ${BANNER_ICON[tone]}`} />}>{tone} · soft</Banner>
                        </div>
                        <div className="relative flex-1 h-14">
                            <Banner variant="solid" tone={tone} icon={<UploadIcon className="w-4 h-4 text-white shrink-0" />}>{tone} · solid</Banner>
                        </div>
                    </div>
                ))}
            </Section>

            <Section title="Button · tile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="tile">
                        <FolderOpenIcon className="w-6 h-6 text-purple-400" />
                        <div className="flex flex-col">
                            <span className="font-bold">Open Game Folder</span>
                            <span className="text-xs text-zinc-400">Opens the install directory in your file manager</span>
                        </div>
                    </Button>
                    <Button variant="tile" tone="deep">
                        <WrenchIcon className="w-6 h-6 text-orange-400" />
                        <div className="flex flex-col">
                            <span className="font-bold">Repair Game</span>
                            <span className="text-xs text-zinc-400">Verifies every file and redownloads what is broken</span>
                        </div>
                    </Button>
                    <Button variant="tile" tone="soft">
                        <WrenchIcon className="w-6 h-6 text-zinc-500" />
                        <div className="flex flex-col">
                            <span className="font-bold">Repair Game</span>
                            <span className="text-xs text-yellow-300 font-medium">Unavailable for Steam imported games</span>
                        </div>
                    </Button>
                    <Button variant="tile" tone="accent">
                        <SpinnerIcon className="w-6 h-6 text-purple-300 animate-spin" />
                        <div className="flex flex-col">
                            <span className="font-bold">Copying authkey…</span>
                            <span className="text-xs text-zinc-400">Reading it out of the game logs</span>
                        </div>
                    </Button>
                    <Button variant="tile" tone="success">
                        <CheckIcon className="w-6 h-6 text-emerald-300" />
                        <div className="flex flex-col">
                            <span className="font-bold">Authkey copied</span>
                            <span className="text-xs text-emerald-300">Paste it into <span className="text-purple-400">aivo.minlor.net/hoyo</span></span>
                        </div>
                    </Button>
                    <Button variant="tile" tone="danger">
                        <CloseIcon className="w-6 h-6 text-red-300" />
                        <div className="flex flex-col">
                            <span className="font-bold">Could not copy authkey</span>
                            <span className="text-xs text-red-300">Launch the game once, then try again</span>
                        </div>
                    </Button>
                </div>
            </Section>

            <Section title="Card">
                <Card>A plain card.</Card>
                <Card className="cursor-pointer" onClick={() => { }}>A clickable card.</Card>
            </Section>

            <Section title="Toggle">
                <Toggle label="Enabled" description="With a description." checked={toggle} onChange={setToggle} />
                <Toggle label="With help" helpText="This is the rich tooltip surface, portalled to the body." checked={toggle} onChange={setToggle} />
                <Toggle label="Disabled" description="Cannot be changed." checked disabled onChange={() => { }} />
                {ALL_TONES.map(tone => (
                    <Toggle key={tone} tone={tone} label={tone} description={`tone="${tone}"`} checked={toggle} onChange={setToggle} />
                ))}
                <div className="flex flex-wrap items-center gap-2">
                    {ALL_TONES.map(tone => (
                        <Toggle key={tone} variant="icon" tone={tone} checked={manifests} onChange={setManifests} icon={PlusCircleIcon} checkedIcon={CloseIcon} hint />
                    ))}
                </div>
            </Section>

            <Section title="Input">
                <Input label="Text" description="Saves on blur, Enter or Escape." value={text} onChange={(e) => setText(e.target.value)} />
                <Input label="With help" helpText="Explains what this field does." value={text} onChange={(e) => setText(e.target.value)} />
                <Input label="Disabled" description="Cannot be edited." value={text} disabled onChange={() => { }} />
                {ALL_TONES.map(tone => (
                    <Input key={tone} tone={tone} label={tone} description="focus it to see the ring" value={text} onChange={(e) => setText(e.target.value)} />
                ))}
            </Section>

            <Section title="PathInput">
                <PathInput label="Install folder" description="The browse button needs an onBrowse handler." value={path} onChange={setPath}
                    onBrowse={async () => "/home/user/Games/picked"} />
                <PathInput label="Disabled" description="Field and browse button are both inert." value={path} disabled onChange={() => { }} />
                {ALL_TONES.map(tone => (
                    <PathInput key={tone} tone={tone} label={tone} description="focus it to see the ring" value={path} onChange={setPath}
                        onBrowse={async () => "/home/user/Games/picked"} />
                ))}
            </Section>

            <Section title="Select">
                <Select label="Option" description="Native select with a chevron overlay." value={choice} onChange={setChoice}
                    options={[{ value: "a", label: "First" }, { value: "b", label: "Second" }, { value: "c", name: "Third" }]} />
                <Select label="Disabled" description="Cannot be changed." value={choice} disabled onChange={() => { }}
                    options={[{ value: "a", label: "First" }, { value: "b", label: "Second" }]} />
                {ALL_TONES.map(tone => (
                    <Select key={tone} tone={tone} label={tone} description="focus it to see the ring" value={choice} onChange={setChoice}
                        options={[{ value: "a", label: "First" }, { value: "b", label: "Second" }, { value: "c", name: "Third" }]} />
                ))}
            </Section>

            <Section title="SidebarItem">
                <div className="flex flex-wrap items-center gap-4">
                    {ALL_TONES.map(tone => (
                        <SidebarItem key={tone} tone={tone} icon={SettingsIcon} label={tone} active />
                    ))}
                </div>
                <div className="flex flex-col items-center gap-4 w-fit">
                    <Toggle variant="icon" checked={manifests} onChange={setManifests} icon={PlusCircleIcon} checkedIcon={CloseIcon} hint />
                    <SidebarItem variant="queue" icon={DownloadIcon} label="Downloads" active={page === "downloads"} onClick={() => setPage(page === "downloads" ? "" : "downloads")} queueCount={3} progress={62} queueLabel={(n) => `${n} items in download queue`} />
                    <SidebarItem variant="queue" icon={DownloadIcon} label="Downloads · idle" />
                    {ALL_TONES.map(tone => (
                        <SidebarItem key={tone} variant="queue" tone={tone} icon={DownloadIcon} label={tone} active queueCount={3} progress={62} queueLabel={(n) => `${n} queued`} />
                    ))}
                    <SidebarItem icon={WineIcon} label="Runners" active={page === "runners"} onClick={() => setPage(page === "runners" ? "" : "runners")} />
                    <SidebarItem icon={SettingsIcon} label="Launcher Settings" active={page === "settings"} onClick={() => setPage(page === "settings" ? "" : "settings")} />
                    <SidebarItem icon={HeartIcon} label="Support the project" />
                </div>
            </Section>

            <Section title="PageHeader">
                <PageHeader icon={SettingsIcon} title="Launcher Settings" subtitle="Configure how the launcher behaves" onBack={() => { }} backLabel="Back" />
                <PageHeader icon={WineIcon} title="Runner Manager" subtitle="2 of 14 installed" onBack={() => { }} backLabel="Back" />
                <PageHeader icon={DownloadIcon} title="Download Manager" subtitle="12.4 MB/s · 3 in queue" tone="info" onBack={() => { }} backLabel="Back" />
                <div className="flex flex-wrap gap-3">
                    {ALL_TONES.map(tone => (
                        <PageHeader key={tone} icon={SettingsIcon} title={tone} tone={tone} onBack={() => { }} backLabel="Back" />
                    ))}
                </div>
            </Section>

            <Section title="Badge">
                <div className="flex flex-wrap items-center gap-3">
                    {ALL_TONES.map(tone => (
                        <Badge key={tone} tone={tone} icon={<CheckIcon className="w-3.5 h-3.5" />}>{tone}</Badge>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {ALL_TONES.map(tone => (
                        <Badge key={tone} variant="bare" tone={tone} icon={<CheckIcon className="w-4 h-4" />}>{tone}</Badge>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {ALL_TONES.map(tone => (
                        <Badge key={tone} variant="progress" tone={tone} progress={45} icon={<SpinnerIcon className="animate-spin w-4 h-4" />}>{tone}</Badge>
                    ))}
                </div>
            </Section>

            <Section title="SpeedGraph">
                <div className="w-full max-w-[800px]">
                    <SpeedGraph history={SPEED} slots={GRAPH_SLOTS} title="Genshin Impact"
                        icon={<DownloadCloudIcon className="w-3 h-3" />} netLabel="Network" diskLabel="Disk" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {ALL_TONES.map(tone => (
                        <div key={tone}>
                            <span className="text-xs text-zinc-500 font-mono">{tone}</span>
                            <SpeedGraph history={SPEED} slots={GRAPH_SLOTS} title={`bars + line · ${tone}`} netTone={tone} diskTone={tone} titleTone={tone}
                                icon={<DownloadCloudIcon className="w-3 h-3" />} netLabel="Network" diskLabel="Disk" />
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="StatTile">
                <div className="flex items-start gap-8">
                    <StatTile variant="glyph" glyph="bars" tone="info" label="Network" value="12.40 MB/s" />
                    <StatTile variant="glyph" glyph="bars" tone="info" label="Peak" value="18.11 MB/s" />
                    <StatTile variant="glyph" glyph="line" tone="success" label="Disk" value="9.82 MB/s" />
                </div>
                <div className="flex items-start gap-8 flex-wrap">
                    {ALL_TONES.map(tone => (
                        <StatTile key={tone} variant="glyph" glyph="bars" tone={tone} label={tone} value="12.40 MB/s" />
                    ))}
                </div>
                <div className="flex items-stretch divide-x divide-white/10">
                    <StatTile icon={ClockIcon} label="Play Time" value="42 hours 15 minutes" />
                    <StatTile icon={CalendarIcon} label="Last Played" value="Today" />
                </div>
            </Section>

            <Section title="Section · popup">
                <Section variant="popup" title="Install Location" icon={<ServerIcon className="w-5 h-5 text-purple-400" />}>
                    <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 overflow-hidden">
                        <div className="p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center shrink-0 border border-white/5">
                                <FolderOpenIcon className="w-6 h-6 text-white/50" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Install path</div>
                                <div className="text-white/90 font-medium truncate font-mono text-sm">/home/user/Games/Genshin Impact</div>
                            </div>
                            <Button variant="outline">Browse</Button>
                        </div>
                    </div>
                </Section>
            </Section>

            <Section title="StorageBar">
                <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 overflow-hidden">
                    <StorageBar label="Storage" total="931.51 GB drive" hasEnoughSpace usedPercent={62} gamePercent={9}
                        used={{ label: "Used", value: "577.53 GB" }} game={{ label: "Game", value: "83.80 GB" }}
                        freeAfter={{ label: "Free after", value: "270.18 GB" }} />
                </div>
                <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 overflow-hidden">
                    <StorageBar label="Storage" total="931.51 GB drive" hasEnoughSpace={false} usedPercent={88} gamePercent={12}
                        used={{ label: "Used", value: "819.72 GB" }} game={{ label: "Game", value: "83.80 GB" }}
                        needMoreText="Need 27.14 GB more" />
                </div>
                <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 overflow-hidden">
                    <StorageBar variant="simple" label="Storage" hasEnoughSpace fillPercent={74}
                        requiredText="83.80 GB required" freeText="113.32 GB free" />
                </div>
                <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 overflow-hidden">
                    <StorageBar variant="simple" label="Storage" hasEnoughSpace={false} fillPercent={100}
                        requiredText="83.80 GB required" freeText="56.66 GB free" insufficientText="Not enough space on this drive" />
                </div>
            </Section>

            <Section title="Dropdown">
                <div className="flex flex-col gap-3">
                    {DROPDOWN_VARIANTS.map(({ variant, size }) => (
                        <div key={`${variant}-${size}`} className="flex items-center gap-3 flex-wrap">
                            <span className="w-36 shrink-0 text-xs text-zinc-500 font-mono">{variant} · {size}</span>
                            {ALL_TONES.map(tone => (
                                <Dropdown key={tone} variant={variant} size={size} tone={tone}
                                    value={version} options={VERSIONS} onChange={(option) => setVersion(option.value)} />
                            ))}
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="EmptyState">
                <EmptyState icon={<DownloadCloudIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />}
                    title="No active downloads" description="Queue a game to see its progress here" />
                <EmptyState variant="inline" title="No items in queue" />
            </Section>

            <Section title="ListRow">
                {ALL_TONES.map(tone => (
                    <ListRow key={tone} variant="panel" title={tone} dot={tone}
                        actions={<Badge tone={tone} icon={<CheckIcon className="w-3.5 h-3.5" />}>{tone}</Badge>} />
                ))}
                <ListRow variant="panel" title="GE-Proton9-27" dot="success"
                    actions={<>
                        <Button variant="icon" size="md" tone="accent" title="Open folder"><FolderOpenIcon className="w-4 h-4" /></Button>
                        <Button variant="icon" size="md" tone="danger" title="Remove"><TrashIcon className="w-4 h-4" /></Button>
                        <Badge tone="success" icon={<CheckIcon className="w-3.5 h-3.5 text-emerald-400" />}>Installed</Badge>
                    </>} />
                <ListRow variant="panel" title="GE-Proton9-26" dot="accent" dotPulse
                    actions={<Badge variant="progress" progress={62} icon={<SpinnerIcon className="animate-spin w-4 h-4 text-purple-300" />}>62%</Badge>} />
                <ListRow variant="panel" title="GE-Proton9-25" dot="muted"
                    actions={<Button variant="chip" size="md"><DownloadIcon className="w-4 h-4" /><span className="text-xs font-medium">Install</span></Button>} />
                <ListRow draggable title="Genshin Impact" titleHint="Genshin Impact" subtitle="Update • Downloading"
                    leading={<div className="flex-shrink-0 text-gray-500 hover:text-gray-300"><BarsIcon className="w-5 h-5" /></div>}
                    media={<div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white/10"><img src={TILES[0]!.icon} alt="" className="w-full h-full object-cover" /></div>}
                    actions={<Button variant="small" tone="info">Start Now</Button>} />
                <ListRow interactive={false} title="Zenless Zone Zero" subtitle="Game"
                    media={<div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-white/10"><img src={TILES[2]!.icon} alt="" className="w-full h-full object-cover" /></div>}
                    actions={<Badge variant="bare" tone="success" icon={<CheckIcon className="w-4 h-4" />}>Completed</Badge>} />
            </Section>

            <Section title="ListRow · reorderable queue">
                <div className="flex flex-col gap-2">
                {queue.map((job, index) => (
                    <ListRow key={job.id} draggable title={job.name} titleHint={job.name} subtitle={`${job.kind} • Queued`}
                        dragging={dragId === job.id} dragOver={overId === job.id && dragId !== job.id}
                        onDragStart={(e) => { setDragId(job.id); e.dataTransfer.effectAllowed = "move"; }}
                        onDragEnd={() => { setDragId(null); setOverId(null); }}
                        onDragOver={(e) => { e.preventDefault(); setOverId(job.id); }}
                        onDragLeave={() => setOverId((id) => (id === job.id ? null : id))}
                        onDrop={(e) => { e.preventDefault(); if (dragId) moveTo(dragId, index); setDragId(null); setOverId(null); }}
                        leading={<div className="flex-shrink-0 text-gray-500 hover:text-gray-300"><BarsIcon className="w-5 h-5" /></div>}
                        media={<div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                            {job.icon
                                ? <img src={job.icon} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-gray-500"><ImageIcon className="w-6 h-6" /></div>}
                        </div>}
                        actions={<div className="flex gap-1 flex-shrink-0">
                            <Button variant="small" tone="info" title="Start downloading this now" onClick={() => moveTo(job.id, 0)}>Start Now</Button>
                            {index > 0 && <Button variant="icon" size="sm" title="Move up" onClick={() => moveTo(job.id, index - 1)}><ChevronUpIcon className="w-4 h-4" /></Button>}
                            {index < queue.length - 1 && <Button variant="icon" size="sm" title="Move down" onClick={() => moveTo(job.id, index + 1)}><ChevronDownIcon className="w-4 h-4" /></Button>}
                            <Button variant="icon" size="sm" tone="danger" title="Remove from queue" onClick={() => setQueue((list) => list.filter((j) => j.id !== job.id))}><CloseIcon className="w-4 h-4" /></Button>
                        </div>} />
                ))}
                {queue.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No items in queue</p>
                    </div>
                )}
                </div>
                {queue.length < QUEUE.length && <Button variant="small" onClick={() => setQueue(QUEUE)}>Reset queue</Button>}
            </Section>

            <Section title="ProgressBar">
                {ALL_TONES.map(tone => (
                    <div key={tone} className="flex items-center gap-3">
                        <span className="w-36 shrink-0 text-xs text-zinc-500 font-mono">{tone}</span>
                        <div className="flex-1"><ProgressBar value={62} tone={tone} /></div>
                        <div className="w-24"><ProgressBar value={62} tone={tone} size="sm" /></div>
                    </div>
                ))}
                <div className="flex items-center gap-3">
                    <span className="w-36 shrink-0 text-xs text-zinc-500 font-mono">warning</span>
                    <div className="px-4 py-2 bg-amber-500/95 rounded-lg shadow-lg flex items-center gap-2">
                        <span className="text-sm font-medium text-amber-900">Loading images (62/100)</span>
                        <div className="w-20"><ProgressBar value={62} tone="warning" size="sm" /></div>
                    </div>
                </div>
            </Section>

            <Section title="Panel">
                <div className="flex gap-3">
                    <Button variant="action" tone="accent" onClick={() => setPanel("hero")}>Hero header</Button>
                    <Button variant="action" onClick={() => setPanel("plain")}>Plain header</Button>
                    <Button variant="action" tone="accent" onClick={() => setPanel("popup")}>Popup</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {ALL_TONES.map(tone => (
                        <Button key={tone} variant="small" onClick={() => { setPanelTone(tone); setPanel("hero"); }}>{tone}</Button>
                    ))}
                </div>
            </Section>

            <Section title="PageOverlay">
                <div className="flex gap-3">
                    <Button variant="action" tone="accent" onClick={() => setPageOpen(true)}>Open page</Button>
                </div>
                <div className="relative h-96 overflow-hidden">
                    <PageOverlay open={pageOpen} onClose={() => setPageOpen(false)}>
                        <div className="p-8 text-sm text-zinc-400">A page slides in here. Escape closes it.</div>
                    </PageOverlay>
                </div>
            </Section>

            <Section title="ContextMenu">
                <div className="flex gap-3">
                    <Button variant="action" tone="accent" onClick={(e) => setMenu({ x: e.clientX, y: e.clientY })}>Open menu</Button>
                </div>
                {menu && <ContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} items={[
                    ...ALL_TONES.map(tone => ({ icon: tone === "discord" ? SteamIcon : SettingsIcon, label: tone, onClick: () => { }, tone })),
                    { kind: "separator" as const },
                    ...ALL_TONES.map(tone => ({ kind: "text" as const, label: `text · ${tone}`, tone })),
                ]} />}
            </Section>

            <Section title="InfoOverlay">
                <div className="relative h-44">
                    <InfoOverlay visible title="Genshin Impact" subtitle="v5.3.0" badge="Update Available" icon={TILES[0]!.icon} iconAlt="Game Icon" />
                    <InfoOverlay variant="stats" visible items={[
                        { icon: ClockIcon, label: "Play Time", value: formatPlaytime(152280, { hour: "hour", hours: "hours", minute: "minute", minutes: "minutes" }) },
                        { icon: CalendarIcon, label: "Last Played", value: formatLastPlayed(Date.now(), { never: "Never", today: "Today", yesterday: "Yesterday" }) },
                    ]} />
                </div>
            </Section>

            <Section title="IconTile">
                <div className="flex flex-wrap items-start gap-3">
                    {ALL_TONES.map(tone => (
                        <IconTile key={tone} variant="install" tone={tone} icon={TILES[0]!.icon} name={tone} hasUpdate />
                    ))}
                </div>
                <div className="flex flex-wrap items-start gap-3">
                    {ALL_TONES.map(tone => (
                        <IconTile key={tone} variant="manifest" tone={tone} icon={TILES[1]!.icon} name={tone} hasUpdate />
                    ))}
                </div>
                <div className="flex flex-wrap items-start gap-3">
                    {ALL_TONES.map(tone => (
                        <IconTile key={tone} variant="floating" tone={tone} icon={TILES[2]!.icon} name={tone} />
                    ))}
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <span className="w-36 shrink-0 text-xs text-zinc-500 font-mono">install · draggable</span>
                        <div className="flex flex-col items-center gap-3">
                            {TILES.map((tile, i) => (
                                <IconTile key={tile.id} variant="install" id={tile.id} icon={tile.icon} name={tile.name} hasUpdate={i === 0}
                                    index={i} isDragging={drag === i} isDragTarget={dropAt === i}
                                    onDragStart={setDrag} onDragEnd={() => { setDrag(null); setDropAt(null); }}
                                    onDragOver={setDropAt} onDrop={() => { setDrag(null); setDropAt(null); }} />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-36 shrink-0 text-xs text-zinc-500 font-mono">floating</span>
                        {TILES.map(tile => <IconTile key={tile.id} variant="floating" sizeClass="w-12 h-12" icon={tile.icon} name={tile.name} />)}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-36 shrink-0 text-xs text-zinc-500 font-mono">manifest</span>
                        {TILES.map(tile => <IconTile key={tile.id} variant="manifest" sizeClass="w-12 h-12" icon={tile.icon} name={tile.name} />)}
                    </div>
                </div>
            </Section>

            <Section title="Tabs">
                <div className="h-72 flex">
                    <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} />
                    <div className="flex-1 p-6 text-sm text-zinc-400">{tab}</div>
                </div>
            </Section>

            <Section title="Tooltip">
                <div className="flex items-center gap-8">
                    <span className="flex items-center gap-2 text-sm">rich <Tooltip variant="rich" text="Hover me. safePolygon keeps this open while the pointer crosses the gap." /></span>
                    <span className="flex items-center gap-2 text-sm">compact <Tooltip text="A plain black label."><span className="px-2 py-1 rounded bg-white/10">hover</span></Tooltip></span>
                </div>
                <div className="flex items-center gap-8 flex-wrap">
                    {(["top", "right", "bottom", "left"] as const).map(side => (
                        <span key={side} className="flex items-center gap-2 text-sm">
                            <span className="text-xs text-zinc-500 font-mono">compact · {side}</span>
                            <Tooltip text={`Placed on the ${side}.`} side={side}>
                                <span className="px-2 py-1 rounded bg-white/10">hover</span>
                            </Tooltip>
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-8 flex-wrap">
                    {(["top", "right", "bottom", "left"] as const).map(side => (
                        <span key={side} className="flex items-center gap-2 text-sm">
                            <span className="text-xs text-zinc-500 font-mono">portal · {side}</span>
                            <Tooltip text={`Portalled, on the ${side}.`} side={side} portal>
                                <span className="px-2 py-1 rounded bg-white/10">hover</span>
                            </Tooltip>
                        </span>
                    ))}
                </div>
            </Section>

            <Section title="Dialog">
                <div className="flex gap-3">
                    {DIALOG_TYPES.map(type => (
                        <Button key={type} variant="action" tone="accent" onClick={() => setDialog(type)}>{type}</Button>
                    ))}
                </div>
            </Section>

            <Section title="MediaControls">
                <div className="relative h-40 overflow-hidden">
                    <img id="app-bg" src={media} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-zinc-500">Fixed to the bottom of the window; it reveals itself while the pointer is over the background area.</p>
                <MediaControls current={media} items={MEDIA} onChange={setMedia} visible mediaElementId="app-bg"
                    previousLabel="Previous Background" nextLabel="Next Background" staticLabel="Static Background" playLabel="Play" pauseLabel="Pause" />
            </Section>

            {panel && (
                <div className="fixed inset-0 z-50">
                <PopupOverlay open onClose={() => setPanel(null)}>
                    {panel === "popup" ? (
                        <Panel variant="popup" tone="dim" size="md" title="Install Game" subtitle="Genshin Impact"
                            onClose={() => setPanel(null)} closeLabel="Close" banner={MEDIA[0]!.src} icon={TILES[0]!.icon}
                            subtitleAction={<Dropdown value={version} options={VERSIONS} onChange={(option) => setVersion(option.value)} />}
                            footer={<>
                                <Button variant="ghost" onClick={() => setPanel(null)}>Cancel</Button>
                                <Button variant="action" tone="accent">Start Download</Button>
                            </>}>
                            <Section variant="popup" title="Install Location" icon={<ServerIcon className="w-5 h-5 text-purple-400" />}>
                                <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 overflow-hidden">
                                    <div className="p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center shrink-0 border border-white/5">
                                            <FolderOpenIcon className="w-6 h-6 text-white/50" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Install path</div>
                                            <div className="text-white/90 font-medium truncate font-mono text-sm">/home/user/Games/Genshin Impact</div>
                                        </div>
                                        <Button variant="outline">Browse</Button>
                                    </div>
                                    <StorageBar label="Storage" total="931.51 GB drive" hasEnoughSpace usedPercent={62} gamePercent={9}
                                        used={{ label: "Used", value: "577.53 GB" }} game={{ label: "Game", value: "83.80 GB" }}
                                        freeAfter={{ label: "Free after", value: "270.18 GB" }} />
                                </div>
                            </Section>
                        </Panel>
                    ) : (
                        <Panel title={`Genshin Impact · ${panelTone}`} tone={panelTone} onClose={() => setPanel(null)} closeLabel="Close"
                            banner={panel === "hero" ? MEDIA[0]!.src : undefined} icon={panel === "hero" ? TILES[0]!.icon : undefined}>
                            <div className="p-8 text-sm text-zinc-400">Panel body. Hover the panel to reveal the close button.</div>
                        </Panel>
                    )}
                </PopupOverlay>
                </div>
            )}

            <DialogOverlay open={dialog !== null} type={dialog ?? "info"} title={`A ${dialog} dialog`}
                message={"Every dialog type, with all three button variants.\nEscape, the backdrop and the X all close it."}
                buttons={[{ label: "Secondary" }, { label: "Danger", variant: "danger" }, { label: "Primary", variant: "primary" }]}
                onClose={() => setDialog(null)} />
        </div>
    );
}
