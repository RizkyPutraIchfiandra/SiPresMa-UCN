import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  variant?: "default" | "light";
}

/**
 * UCN brand mark — graduation cap silhouette over a teal shield.
 * Mewakili Universitas Cendekia Nusantara.
 */
export function Logo({ className, size = 40, variant = "default" }: LogoProps) {
  const idSuffix = variant === "light" ? "-light" : "";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="Logo Universitas Cendekia Nusantara"
      role="img"
    >
      <defs>
        <linearGradient id={`u-bg${idSuffix}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="55%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      {/* Shield rounded-square */}
      <rect x="2" y="2" width="60" height="60" rx="16" fill={`url(#u-bg${idSuffix})`} />
      {/* Graduation cap (mortarboard) */}
      <path d="M10 26 L32 18 L54 26 L32 34 Z" fill="#ffffff" />
      <path
        d="M20 30 L20 40 C20 43 25 46 32 46 C39 46 44 43 44 40 L44 30"
        fill="none"
        stroke="#ffffff"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Tassel */}
      <line x1="50" y1="26" x2="50" y2="38" stroke="#ffffff" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx="50" cy="40" r="2" fill="#ffffff" />
    </svg>
  );
}

export function LogoWithName({
  size = 40,
  className,
  subtitle,
  variant = "default",
}: LogoProps & { subtitle?: string }) {
  const isLight = variant === "light";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Logo size={size} variant={variant} />
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display text-base font-extrabold tracking-[0.12em]",
            isLight ? "text-white" : "text-slate-900"
          )}
        >
          SiPresMa <span className={isLight ? "text-cyan-300" : "text-teal-600"}>UCN</span>
        </span>
        {subtitle && (
          <span
            className={cn(
              "text-[10px] uppercase tracking-[0.2em]",
              isLight ? "text-cyan-200/80" : "text-slate-500"
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}