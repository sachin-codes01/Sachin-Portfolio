import { footer, site } from '../data/site'

export default function Footer() {
  return (
    <footer className="rule mx-auto flex max-w-375 flex-col gap-4 px-5 py-6 text-[12px] text-ink/55 md:flex-row md:items-center md:justify-between md:px-10">
      <span>
        © {new Date().getFullYear()} {site.domain}
      </span>

      <div className="flex flex-wrap gap-x-8 gap-y-2">
        {footer.columns.map((column) => (
          <a
            key={column.label}
            href={column.href}
            className="group flex items-baseline gap-2 transition-colors hover:text-ink"
          >
            <span className="eyebrow text-ink/35 group-hover:text-flame">{column.label}</span>
            <span>{column.value}</span>
          </a>
        ))}
      </div>
    </footer>
  )
}
