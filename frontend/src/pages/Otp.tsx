import { useEffect, useRef, useState } from 'react'
import type { ClipboardEvent, FormEvent, KeyboardEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { DEFAULT_DIAL_CODE, loginUser, registerUser } from '../api/auth'
import { getErrorMessage } from '../api/client'
import { BackArrow } from '../components/Icons'
import Screen from '../components/Screen'
import { useAuth } from '../context/AuthContext'

const OTP_LENGTH = 6
const RESEND_SECONDS = 30

interface LocationState {
  phone?: string
  dialCode?: string
}

const emptyOtp = () => Array<string>(OTP_LENGTH).fill('')

export default function Otp() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const state = useLocation().state as LocationState | null
  const phone = state?.phone
  const dialCode = state?.dialCode ?? DEFAULT_DIAL_CODE

  const [values, setValues] = useState<string[]>(emptyOtp)
  const [seconds, setSeconds] = useState(RESEND_SECONDS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  // 30 second ka resend countdown
  useEffect(() => {
    if (seconds <= 0) return
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
  }, [seconds])

  // Number ke bina yahan aaye (jaise refresh): wapas sign up par
  if (!phone) return <Navigate to="/signup" replace />

  const otp = values.join('')
  const isComplete = otp.length === OTP_LENGTH

  const focusAt = (index: number) => inputs.current[index]?.focus()

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    setError('')
    setValues((prev) => prev.map((v, i) => (i === index ? digit : v)))
    if (digit && index < OTP_LENGTH - 1) focusAt(index + 1)
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      setValues((prev) => prev.map((v, i) => (i === index - 1 ? '' : v)))
      focusAt(index - 1)
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusAt(index - 1)
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusAt(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    e.preventDefault()
    setError('')
    setValues(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? ''))
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isComplete || loading) return
    setLoading(true)
    setError('')
    try {
      const token = await loginUser(phone, otp, dialCode)
      signIn(token)
      navigate('/home', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid OTP. Please try again.'))
      setValues(emptyOtp())
      focusAt(0)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (seconds > 0) return
    setError('')
    try {
      await registerUser(phone, dialCode)
      setValues(emptyOtp())
      setSeconds(RESEND_SECONDS)
      focusAt(0)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not resend the OTP.'))
    }
  }

  const timer = `00:${String(seconds).padStart(2, '0')}`
  const formattedPhone = `${dialCode} ${phone.slice(0, 5)} ${phone.slice(5)}`

  const box = (index: number) => (
    <input
      key={index}
      ref={(el) => {
        inputs.current[index] = el
      }}
      type="text"
      inputMode="numeric"
      autoComplete={index === 0 ? 'one-time-code' : 'off'}
      autoFocus={index === 0}
      maxLength={1}
      value={values[index]}
      onChange={(e) => handleChange(index, e.target.value)}
      onKeyDown={(e) => handleKeyDown(index, e)}
      onPaste={handlePaste}
      onFocus={(e) => e.target.select()}
      aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
      className="h-12 w-10.5 rounded-md border border-gray-300 bg-white text-center text-lg font-semibold text-slate-ink caret-primary outline-none focus:border-primary"
    />
  )

  return (
    <Screen>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-5 pt-14 pb-5">
        <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="mb-6 w-fit cursor-pointer text-primary">
          <BackArrow />
        </button>

        <h1 className="text-[22px] font-bold text-slate-ink">6-digit code</h1>
        <p className="mt-2 text-[15px] leading-snug text-muted">
          Please enter the code we&apos;ve sent to
          <br />
          <span className="font-bold text-slate-ink">{formattedPhone}</span>
        </p>

        <div className="mt-8 flex items-center gap-2">
          {[0, 1, 2].map(box)}
          <span className="px-0.5 text-slate-ink">-</span>
          {[3, 4, 5].map(box)}
        </div>

        <p className="mt-4 text-[13px] text-slate-ink">
          {seconds > 0 ? (
            <>
              I didn&apos;t receive a code <span className="font-semibold text-primary">({timer})</span>
            </>
          ) : (
            <button type="button" onClick={handleResend} className="font-semibold text-primary underline">
              Resend code
            </button>
          )}
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!isComplete || loading}
          className="mt-auto h-12 w-full rounded-lg bg-primary text-[16px] font-semibold tracking-wide text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Continue'}
        </button>
      </form>
    </Screen>
  )
}