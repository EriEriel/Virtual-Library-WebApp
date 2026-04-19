"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { registerUser } from "@/lib/actions/register"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await registerUser(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Auto sign in after registration
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      callbackUrl: "/",
    })
  }

  return (
    <div className="min-h-screen bg-[#202123] flex items-center justify-center px-4 font-mono">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8 border-b border-[#2f3133] pb-6">
          <div className="text-[11px] text-[#4b5563] tracking-widest mb-4 uppercase">
            System // Registration
          </div>
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">
            Create_Account
          </h1>
          <p className="text-xs text-[#4b5563] mt-1">
            {"// start building your online archive"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "name", label: "name", type: "text", placeholder: "your name", required: true },
            { id: "email", label: "email", type: "email", placeholder: "you@example.com", required: true },
            { id: "password", label: "password", type: "password", placeholder: "••••••••", required: true, minLength: 8 },
          ].map(({ id, label, type, placeholder, required, minLength }) => (
            <div key={id} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
              <label htmlFor={id} className="text-[11px] text-[#4b5563] sm:w-20 shrink-0 tracking-wide uppercase">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                required={required}
                minLength={minLength}
                className="flex-1 bg-[#16171a] border border-[#2f3133] text-slate-200 text-xs px-2 py-2 focus:outline-none focus:border-green-400 placeholder:text-[#374151] transition-colors font-mono w-full"
              />
            </div>
          ))}

          {error && (
            <div className="border-l-2 border-red-500 pl-2 py-1 bg-[#16171a] mt-2">
              <p className="text-[11px] text-red-500">// {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-4 py-2.5 bg-green-400 text-[#1a1b1d] text-xs font-bold border border-green-400 hover:bg-green-300 transition-colors disabled:opacity-50 tracking-widest uppercase flex items-center justify-center"
          >
            {loading ? <Spinner light={false} /> : "$ execute_registration"}
          </button>
        </form>

        <p className="text-[11px] text-[#4b5563] text-center mt-8">
          {"// already indexed? "}
          <a href="/login" className="text-green-400 hover:text-green-300 transition-colors underline underline-offset-4">
            sign_in
          </a>
        </p>

      </div>
    </div>
  )

  function Spinner({ light }: { light?: boolean }) {
    return (
      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={light ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)"} strokeWidth="3" />
        <path d="M22 12a10 10 0 00-10-10" stroke={light ? "white" : "#1a1b1d"} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
}
