import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_DIAL_CODE, registerUser } from '../api/auth'
import { getErrorMessage } from '../api/client'
import { BackArrow } from '../components/Icons'
import Screen from '../components/Screen'

const PHONE_LENGTH = 10

export default function SignUp() {
  const navigate = useNavigate()
  const [digits, setDigits] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValid = digits.length === PHONE_LENGTH
  // 98189 - 79450 jaisa display, state me sirf raw digits rehte hain
  const display = digits.length > 5 ? `${digits.slice(0, 5)} - ${digits.slice(5)}` : digits

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('')
    setDigits(e.target.value.replace(/\D/g, '').slice(0, PHONE_LENGTH))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValid || loading) return
    setLoading(true)
    setError('')
    try {
      await registerUser(digits, DEFAULT_DIAL_CODE)
      navigate('/otp', { state: { phone: digits, dialCode: DEFAULT_DIAL_CODE } })
    } catch (err) {
      setError(getErrorMessage(err, 'Could not send the OTP. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col px-5 pt-14 pb-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="mb-6 w-fit cursor-pointer text-primary"
        >
          <BackArrow />
        </button>

        <h1 className="text-[22px] font-bold text-slate-ink">Sign Up to Fastor</h1>
        <p className="mt-2 text-[15px] leading-snug text-muted">
          Let us know your mobile number and we will send you an OTP for verification.
        </p>

        <label className="mt-9 flex h-14 items-center rounded-lg border border-gray-200 bg-gray-100 px-4 focus-within:border-primary">
          <span className="pr-4 text-[15px] font-bold text-slate-ink">{DEFAULT_DIAL_CODE}</span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            autoFocus
            value={display}
            onChange={handleChange}
            placeholder="00000 - 00000"
            aria-label="Mobile number"
            className="min-w-0 flex-1 bg-transparent text-[16px] tracking-wide text-slate-ink outline-none placeholder:text-gray-400"
          />
        </label>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-auto pt-8">
          <button
            type="submit"
            disabled={!isValid || loading}
            className="h-12 w-full rounded-lg bg-primary text-[16px] font-semibold tracking-wide text-white transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Get OTP'}
          </button>
          <p className="mt-3 text-center text-[11px] text-muted">
            By clicking, I accept the <span className="font-semibold text-slate-ink">Terms &amp; Conditions</span> and{' '}
            <span className="font-semibold text-slate-ink">Privacy Policy</span>
          </p>
        </div>
      </form>
    </Screen>
  )
}