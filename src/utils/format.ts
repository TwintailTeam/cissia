export function formatBytes(bytes: number): string {
    if (bytes > 1000 * 1000 * 1000) {
        return (bytes / 1000.0 / 1000.0 / 1000.0).toFixed(2) + ' GB';
    } else if (bytes > 1000 * 1000) {
        return (bytes / 1000.0 / 1000.0).toFixed(2) + ' MB';
    } else if (bytes > 1000) {
        return (bytes / 1000.0).toFixed(2) + ' KB';
    } else {
        return bytes.toFixed(2) + ' B';
    }
}

export function formatSpeed(bytesPerSecond: number): string {
    if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) return '0 B/s';
    return `${formatBytes(bytesPerSecond)}/s`;
}

export interface PlaytimeLabels {
    hour: string;
    hours: string;
    minute: string;
    minutes: string;
}

export interface LastPlayedLabels {
    never: string;
    today: string;
    yesterday: string;
}

export function formatPlaytime(value: string | number | undefined, labels: PlaytimeLabels): string {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return `0 ${labels.minutes}`;

    const totalSeconds = Math.floor(parsed);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const hourLabel = hours === 1 ? labels.hour : labels.hours;
    const minuteLabel = minutes === 1 ? labels.minute : labels.minutes;

    if (hours <= 0) return `${new Intl.NumberFormat().format(minutes)} ${minuteLabel}`;
    if (minutes <= 0) return `${new Intl.NumberFormat().format(hours)} ${hourLabel}`;
    return `${new Intl.NumberFormat().format(hours)} ${hourLabel} ${minutes} ${minuteLabel}`;
}

export function formatLastPlayed(value: string | number | undefined, labels: LastPlayedLabels, locale?: string): string {
    if (value === undefined || value === null || value === "") return labels.never;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return labels.never;

    const timestampMs = parsed > 1_000_000_000_000 ? parsed : parsed * 1000;
    const date = new Date(timestampMs);
    if (Number.isNaN(date.getTime())) return labels.never;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const dayDiff = Math.floor((startOfToday - startOfDate) / 86400000);

    if (dayDiff === 0) return labels.today;
    if (dayDiff === 1) return labels.yesterday;

    const intlLocale = locale ? locale.replace(/_/g, "-") : undefined;
    return date.toLocaleDateString(intlLocale, { month: "short", day: "numeric", year: "numeric" });
}
