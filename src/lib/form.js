export const fieldSx = {
  '& .MuiInputBase-root': { borderBottom: '1px solid rgba(11,11,11,0.25)' },
  '& .MuiInputBase-root.Mui-focused': { borderBottomColor: '#0b0b0b' },
  '& .MuiInputBase-root.Mui-error': { borderBottomColor: '#d3302f' },
  '& .MuiInputBase-input::placeholder': { opacity: 0.45, fontSize: 14 },
  '& .MuiSelect-select': { paddingBlock: '14px' },
}

const emailLooksReal = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

export const PROJECT_EMPTY = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  design: '',
  references: '',
  requirements: '',
}

export const PROJECT_TYPES = [
  'A website',
  'An online store',
  'A landing page or portfolio site',
  'A mobile app',
  'Video editing',
  'Not sure yet — help me decide',
]

export const DESIGN_STATUS = [
  'I already have designs (Figma, XD, PSD)',
  'I have websites I want it to look like',
  'No design yet — I need help with that too',
]

export function validateProject(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Tell me what to call you.'
  if (!emailLooksReal(values.email)) errors.email = 'That email looks incomplete.'
  if (!values.projectType) errors.projectType = 'Pick the closest one.'
  if (values.requirements.trim().length < 10) {
    errors.requirements = 'List a few things it needs to do.'
  }
  return errors
}

export function projectMessage(values) {
  const lines = [
    `Project enquiry from ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
  ]
  if (values.company.trim()) lines.push(`Company: ${values.company.trim()}`)
  lines.push(`Wants: ${values.projectType}`)
  if (values.design) lines.push(`Design: ${values.design}`)
  if (values.references.trim()) lines.push(`References: ${values.references.trim()}`)
  lines.push('', 'Needs to do:', values.requirements.trim())
  return lines.join('\n')
}

export const COLLAB_EMPTY = {
  name: '',
  email: '',
  role: '',
  stack: '',
  goal: '',
  links: '',
  message: '',
}

export const ROLES = [
  'Frontend developer',
  'Backend developer',
  'Full-stack developer',
  'MERN stack developer',
  'React / Next.js developer',
  'Node.js developer',
  'Python developer',
  'Java developer',
  'PHP / WordPress developer',
  'Mobile app developer',
  'DevOps / cloud',
  'QA / testing',
  'Data / AI / ML',
  'UI / UX designer',
  'Graphic designer',
  'Video & content',
  'Student, still figuring it out',
  'Something else',
]

export const GOALS = [
  'Build a project together',
  'Learn and practise together',
  'Job hunting together',
  'Contribute to open source',
  'Just connect for now',
]

export function validateCollab(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Tell me what to call you.'
  if (!emailLooksReal(values.email)) errors.email = 'That email looks incomplete.'
  if (!values.goal) errors.goal = 'Pick what you are after.'
  if (values.message.trim().length < 10) errors.message = 'A sentence or two, at least.'
  return errors
}

export function collabMessage(values) {
  const lines = [
    `Hey Sachin — ${values.name.trim()} here, let's team up.`,
    `Email: ${values.email.trim()}`,
  ]
  if (values.role) lines.push(`I am a: ${values.role}`)
  if (values.stack.trim()) lines.push(`Stack: ${values.stack.trim()}`)
  lines.push(`Looking to: ${values.goal}`)
  if (values.links.trim()) lines.push(`Links: ${values.links.trim()}`)
  lines.push('', values.message.trim())
  return lines.join('\n')
}

export function chatUrl(phone, text) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export const HANDOFF_DELAY = 900

export function goToChat(phone, text) {
  window.location.href = chatUrl(phone, text)
}
