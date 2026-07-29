import { useState } from 'react'

export function useEnquiryForm({ empty, validate, onValid }) {
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})

  const update = (key) => (event) => {
    const { value } = event.target
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return

    onValid(values)
    setValues(empty)
  }

  return { values, errors, update, handleSubmit }
}
