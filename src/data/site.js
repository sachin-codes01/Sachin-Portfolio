import mdnOpen from '../assets/projects/mdn-open.png'
import mdnRest from '../assets/projects/mdn-rest.png'
import mdnSlim from '../assets/projects/mdn-slim.png'
import mdnAbout from '../assets/projects/mdn-about.png'

import recipeOpen from '../assets/projects/recipe-open.png'
import recipeRest from '../assets/projects/recipe-rest.png'
import recipeSlim from '../assets/projects/recipe-slim.png'
import recipeAbout from '../assets/projects/recipe-about.png'

import nexoOpen from '../assets/projects/nexochat-open.png'
import nexoRest from '../assets/projects/nexochat-rest.png'
import nexoSlim from '../assets/projects/nexochat-slim.png'
import nexoAbout from '../assets/projects/nexochat-about.png'

import movieOpen from '../assets/projects/movie-open.png'
import movieRest from '../assets/projects/movie-rest.png'
import movieSlim from '../assets/projects/movie-slim.png'

import weatherOpen from '../assets/projects/weather-open.png'
import weatherRest from '../assets/projects/weather-rest.png'
import weatherSlim from '../assets/projects/weather-slim.png'

import wpbmOpen from '../assets/projects/wpbm-open.jpg'
import wpbmRest from '../assets/projects/wpbm-rest.jpg'
import wpbmSlim from '../assets/projects/wpbm-slim.jpg'

const img = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const site = {
  domain: 'sachin.codes01',
  name: 'Sachin',
  email: 'sachin.codes01@gmail.com',
  location: 'Ghaziabad, Uttar Pradesh, India',
  whatsapp: '917217344896',
}

export const nav = [
  { label: 'home', href: '#top' },
  { label: 'about', href: '#about' },
  { label: 'projects', href: '#gallery' },
  { label: 'blog', href: '#person' },
  { label: 'contact', href: '#contact' },
]

export const socials = [
  { label: 'Instagram', short: 'Ig', href: 'https://www.instagram.com/sachin_28022005' },
  { label: 'Email', short: '@', href: 'mailto:sachin.codes01@gmail.com' },
  { label: 'LinkedIn', short: 'In', href: 'https://www.linkedin.com/in/sachin-kumar-b814683a9' },
  { label: 'GitHub', short: 'Gh', href: 'https://github.com/sachin-codes01' },
]

export const hero = {
  owner: "Sachin's",
  title: 'portfolio.',
  lines: ['Digital + print.', 'Concept to production.'],
  portrait: img('portrait-lead', 1600, 900),
}

export const workHeading = 'What I do'

export const services = [
  {
    id: '01',
    title: 'Web developer',
    body: 'Full-stack MERN work, built and deployed end to end. React on the front with hooks, React Router and responsive layouts; Express and Node behind it, MongoDB underneath. I design the REST APIs, wire up authentication and handle CRUD across both client and server.',
    meta: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Firebase Auth'],
  },
  {
    id: '02',
    title: 'App developer',
    body: 'React Native, so the component architecture and hooks I use on the web carry straight across to mobile. Same JavaScript, same patterns, mobile-first UI — which keeps a project consistent when it needs to exist on the web and on a phone.',
    meta: ['React Native', 'JavaScript (ES6+)', 'Component architecture', 'Mobile-first UI'],
  },
  {
    id: '03',
    title: 'Video editor',
    body: 'Premiere Pro and DaVinci Resolve for the real cuts — timeline work, colour, sound. CapCut when something needs to be turned around fast and does not justify a full project setup.',
    meta: ['Premiere Pro', 'DaVinci Resolve', 'CapCut', 'Colour grading'],
  },
]

export const about = {
  heading: 'About me',
  paragraphs: [
    "I'm a MERN stack developer from Ghaziabad. I build full-stack web apps end to end — React on the front, Node and Express behind it, MongoDB underneath — and I have designed, built and deployed every one of my projects independently.",
    'In practice that has meant REST API design, authentication flows, CRUD across client and server, and interfaces that still hold together on a phone. More recently it extends to React Native on mobile, and to video work in Premiere Pro and DaVinci Resolve.',
    'I finished my BCA at Choudhary Charan Singh University in 2025. I am looking for a software development internship where I can work on real products and grow under people who know more than I do.',
  ],
  facts: [
    { label: 'Education', value: 'BCA — Choudhary Charan Singh University, 2025' },
    { label: 'Based in', value: 'Ghaziabad, Uttar Pradesh, India' },
    { label: 'Languages', value: 'English, Hindi' },
    {
      label: 'Open to',
      value: [
        'Frontend developer internship',
        'Backend developer internship',
        'MERN stack developer internship',
        'Similar opportunities',
      ],
    },
  ],
  stack: [
    'React.js',
    'React Native',
    'Node.js',
    'Express.js',
    'MongoDB',
    'JavaScript (ES6+)',
    'HTML5',
    'CSS3',
    'React Router',
    'React Hooks',
    'REST APIs',
    'Firebase Auth',
    'Git & GitHub',
    'Responsive design',
  ],
  wideImage: {
    src: mdnAbout,
    alt: 'MDN Supplement Website — MERN stack storefront',
    caption: 'MDN — MERN stack e-commerce',
    href: 'https://mdn-my-daily-nutrition.vercel.app/',
    ratio: 'aspect-3/2',
  },
  images: [
    {
      src: nexoAbout,
      alt: 'NexoChat — real-time chat built with React and Firebase',
      caption: 'NexoChat — real-time chat, Firebase',
      href: 'https://nexochat.netlify.app/',
      ratio: 'aspect-square',
    },
    {
      src: recipeAbout,
      alt: 'Recipe Finder — React app using the Spoonacular API',
      caption: 'Recipe Finder — React + Spoonacular API',
      href: 'https://recipes-finder-webapp.netlify.app/',
      ratio: 'aspect-4/3',
    },
  ],
}

export const galleryFallbackHref = 'https://github.com/sachin-codes01'

export const projects = [
  {
    title: 'MDN Supplement',
    tag: 'Live site',
    year: '2025',
    shots: { open: mdnOpen, rest: mdnRest, slim: mdnSlim },
    href: 'https://mdn-my-daily-nutrition.vercel.app/',
  },
  {
    title: 'NexoChat',
    tag: 'Live site',
    year: '2025',
    shots: { open: nexoOpen, rest: nexoRest, slim: nexoSlim },
    href: 'https://nexochat.netlify.app/',
  },
  {
    title: 'Recipe Finder',
    tag: 'Live site',
    year: '2025',
    shots: { open: recipeOpen, rest: recipeRest, slim: recipeSlim },
    href: 'https://recipes-finder-webapp.netlify.app/',
  },
  {
    title: 'Movie Search',
    tag: 'Repo',
    year: '2025',
    shots: { open: movieOpen, rest: movieRest, slim: movieSlim },
    href: 'https://github.com/sachin-codes01/Mini-Projects/tree/main/10_Movie_Search_App',
  },
  {
    title: 'Weather App',
    tag: 'Repo',
    year: '2025',
    shots: { open: weatherOpen, rest: weatherRest, slim: weatherSlim },
    href: 'https://github.com/sachin-codes01/Weather-App',
  },
  {
    title: 'WPBM Android App',
    tag: 'Download APK',
    year: '2025',
    shots: { open: wpbmOpen, rest: wpbmRest, slim: wpbmSlim },
    href: '/WPBM.apk',
    download: 'WPBM.apk',
  },
  {
    title: 'Want to see more projects?',
    tag: 'GitHub',
    year: 'All of it',
    isMore: true,
    shots: {
      open: img('github-more-open', 1382, 992),
      rest: img('github-more-rest', 768, 992),
      slim: img('github-more-slim', 410, 992),
    },
    href: galleryFallbackHref,
  },
]

export const person = {
  heading: ["I'm also", 'a', 'real', 'person!'],
  portrait: img('drummer', 900, 1100),
  notes: [
    'I finished my BCA at Choudhary Charan Singh University in 2025 and picked up the MERN stack alongside it. Every project on this site I planned, built and deployed on my own.',
    'Code is not the only thing I make. I edit video in Premiere Pro and DaVinci Resolve, and reach for CapCut when something needs turning around fast.',
    'Based in Ghaziabad, working in English and Hindi. Looking for an internship where I can build real products and learn from people further along than me.',
  ],
  cta: 'Get in touch',
}

export const process = {
  label: 'How a project runs',
  heading: ['From brief', 'to handover'],
  steps: [
    {
      id: '01',
      title: 'Brief',
      body: 'You send the form or message me. I ask what it has to do, who it is for, and what already exists — copy, logo, hosting, anything.',
    },
    {
      id: '02',
      title: 'Design',
      body: 'Layout first, then the real screens. You see and approve how it looks before I write a line of code.',
    },
    {
      id: '03',
      title: 'Build',
      body: 'React on the front, Node and MongoDB behind it. You get a preview link and can watch it come together as I go.',
    },
    {
      id: '04',
      title: 'Deploy',
      body: 'Put live, your domain connected, checked on phone, tablet and desktop before anyone else sees it.',
    },
    {
      id: '05',
      title: 'Handover',
      body: 'Source code, a walkthrough of how to run it, and two weeks of fixes after launch at no extra cost.',
    },
  ],
}

export const included = {
  label: "What's included",
  heading: ['Every project', 'ships with'],
  items: [
    { title: 'Responsive on every screen', body: 'Phone, tablet and desktop — checked on real sizes, not just a browser resize.' },
    { title: 'Deployed and live', body: 'Hosted, your domain connected, HTTPS working. Not a zip file you have to figure out.' },
    { title: 'Full source code', body: 'Pushed to your GitHub or handed over. You own it outright — no lock-in, no licence.' },
    { title: 'Fast and findable', body: 'Optimised images, sensible page titles and meta tags so search engines can read it.' },
    { title: 'Two weeks of fixes', body: 'Anything broken after launch, I fix free. Bugs are my problem, not yours.' },
    { title: 'You talk to me', body: 'No account manager, no ticket queue. The person building it is the person replying.' },
  ],
}

export const faq = {
  label: 'Before you ask',
  heading: ['Questions', 'people ask'],
  items: [
    {
      q: 'How long does a website take?',
      a: 'A landing page or portfolio site is usually one to two weeks. A full site with a database, logins and an admin panel is closer to four to six. I give you a real date after the brief, not before — and if something is going to slip, you hear it from me early rather than on the deadline.',
    },
    {
      q: 'Do you handle hosting and the domain?',
      a: 'Yes. I deploy to Vercel or Netlify, which covers hosting for most projects at no running cost, and I connect your domain and set up HTTPS. If you have not bought a domain yet I will tell you what to buy and where — you keep it in your own name, not mine.',
    },
    {
      q: 'What if I want changes later?',
      a: 'Small fixes in the first two weeks after launch are free. After that, changes are quoted per job — usually small. Because you get the full source code, you are never stuck with me: any developer can pick it up.',
    },
    {
      q: 'How do payments work?',
      a: 'Half up front so I can start, half when it is finished and you are happy. Nothing is locked behind a final payment — you see the work live before you settle up. For very small jobs I usually just invoice at the end.',
    },
    {
      q: 'Can you work from a design I already have?',
      a: 'Yes, and it makes things faster. Figma, XD, PSD or even screenshots of sites you like are all fine. If you have nothing, I design it too — say so in the form and I will include that in the plan.',
    },
    {
      q: 'You are a fresher — why should I hire you?',
      a: 'Because you get my full attention and a fair price, and because I have built and deployed real full-stack projects on my own — the ones in the gallery are live, with the code public. If that is not enough for the size of what you need, I will tell you honestly rather than take the work.',
    },
  ],
}

export const contact = {
  heading: ['Tell me what', 'I can build', 'for you.'],
  intro:
    'Tell me what you need and what it has to do — I will come back with the scope, how long it takes and what it costs. Asking costs nothing.',
  buildsLabel: 'What I make',
  builds: ['Websites', 'Mobile apps', 'Video editing'],
  pitch:
    'Built properly, priced for small teams and first projects. No agency overheads, no account manager in the middle — you work with me directly, start to finish.',
  note: 'The more detail you give here, the more accurate the quote. Screenshots and links to sites you like help more than anything.',
  portrait: {
    src: img('sachin-portrait', 800, 1000),
    alt: 'Placeholder — replace with a photo of yourself',
    ratio: 'aspect-4/5',
  },
}

export const workTogether = {
  heading: ["Let's work", 'together'],
  linksLabel: 'Or contact me',
  intro:
    'I am a fresher, and I would rather not do it alone. If you are learning the same stack, shipping side projects at night, or hunting for a first role — tell me and let us do it together.',
  availability:
    'Building things, learning fast, and looking for people at the same stage to build and job-hunt alongside.',
  formNote: 'No agency, no pitch. Two people building things.',
  links: [
    { label: 'Instagram', href: 'https://www.instagram.com/sachin_28022005', external: true },
    { label: 'Email', href: 'mailto:sachin.codes01@gmail.com', external: false },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sachin-kumar-b814683a9', external: true },
    { label: 'GitHub', href: 'https://github.com/sachin-codes01', external: true },
  ],
}

export const footer = {
  columns: [
    { label: 'email', value: 'sachin.codes01@gmail.com', href: 'mailto:sachin.codes01@gmail.com' },
    { label: 'linkedin', value: 'sachin-kumar', href: 'https://www.linkedin.com/in/sachin-kumar-b814683a9' },
    { label: 'github', value: 'sachin-codes01', href: 'https://github.com/sachin-codes01' },
  ],
}
