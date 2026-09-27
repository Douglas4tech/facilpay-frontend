import { CopyButton } from "./copy-button";
import { Tooltip } from "./tooltip";
import { cn } from "./utils";

export function truncateAddress(address: string, start = 4, end = 4) {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}…${address.slice(-end)}`;
}

export function AddressDisplay({
  address,
  start = 4,
  end = 4,
  className,
}: {
  address: string;
  start?: number;
  end?: number;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex max-w-full items-center gap-1", className)}>
      <Tooltip content={<code className="break-all font-mono">{address}</code>}>
        <code tabIndex={0} aria-label={`Address ${address}`} className="truncate font-mono text-sm text-foreground">
          {truncateAddress(address, start, end)}
        </code>
      </Tooltip>
      <CopyButton value={address} label="Copy address" />
    </div>
  );
}