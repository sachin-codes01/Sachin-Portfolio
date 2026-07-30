import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import { about } from '../data/site'
import Reveal from './Reveal'

export default function About() {
  return (
    <section id="about" className="band [--band:var(--color-cream)] overflow-hidden pb-16 md:pb-28">
      <div className="mx-auto grid max-w-375 gap-10 px-5 md:grid-cols-12 md:gap-8 md:px-10">
        <Reveal from="left" className="md:col-span-3" amount={0.1} duration={1.1}>
          <h2 className="font-display text-[16vw] uppercase leading-[0.8] tracking-[-0.02em] text-crimson md:sticky md:top-24 md:[writing-mode:vertical-rl] md:rotate-180 md:text-[13vw]">
            {about.heading}
          </h2>
        </Reveal>

        <div className="flex flex-col md:col-span-5 md:col-start-4 md:pt-24">
          {about.paragraphs.map((paragraph, i) => (
            <Reveal key={paragraph.slice(0, 24)} from="up" delay={i * 0.12} amount={0.2}>
              <p className="mb-5 text-[13.5px] leading-[1.75] text-crimson">{paragraph}</p>
            </Reveal>
          ))}

          <Reveal from="up" delay={0.1} amount={0.15}>
            <dl className="mt-9 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-crimson/25 pt-7 sm:grid-cols-2">
              {about.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="eyebrow text-crimson/55">{fact.label}</dt>
                  <dd className="mt-1 text-[13px] leading-snug text-crimson">
                    {Array.isArray(fact.value)
                      ? fact.value.map((line, i) => (
                          <span key={line} className="block">
                            {line}
                            {i < fact.value.length - 1 ? ',' : ''}
                          </span>
                        ))
                      : fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal
            from="up"
            delay={0.14}
            amount={0.1}
            as="figure"
            className="group mt-9 flex flex-col md:flex-1"
          >
            <figcaption className="eyebrow mb-2 flex items-center gap-1.5 text-crimson/70 transition-colors group-hover:text-crimson">
              {about.wideImage.caption}
              <ArrowOutwardIcon sx={{ fontSize: 12 }} />
            </figcaption>
            <a
              href={about.wideImage.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${about.wideImage.caption} — open the live site`}
              className={`block overflow-hidden bg-crimson ${about.wideImage.ratio} md:aspect-auto md:min-h-50 md:flex-1`}
            >
              <img
                src={about.wideImage.src}
                alt={about.wideImage.alt}
                loading="lazy"
                className="size-full object-fill mix-blend-luminosity opacity-90 transition-opacity duration-500 group-hover:opacity-100"
              />
            </a>
          </Reveal>
        </div>

        <div className="flex flex-col gap-4 md:col-span-3 md:col-start-10 md:pt-40">
          {about.images.map((image, i) => (
            <Reveal
              key={image.src}
              from="right"
              delay={i * 0.14}
              amount={0.15}
              as="figure"
              className="group"
            >
              <figcaption className="eyebrow mb-2 flex items-center gap-1.5 text-crimson/70 transition-colors group-hover:text-crimson">
                {image.caption}
                <ArrowOutwardIcon sx={{ fontSize: 12 }} />
              </figcaption>
              <a
                href={image.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${image.caption} — open the live site`}
                className={`block overflow-hidden bg-crimson ${image.ratio}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="size-full object-fill mix-blend-luminosity opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                />
              </a>
            </Reveal>
          ))}

          <Reveal from="right" delay={0.2} amount={0.1}>
            <p className="eyebrow mt-4 border-t border-crimson/25 pt-5 text-crimson/55">Stack</p>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
              {about.stack.map((item) => (
                <li
                  key={item}
                  className="border border-crimson/35 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-crimson"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
