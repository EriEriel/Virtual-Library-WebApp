"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setLoading("credentials")
    setError(null)
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    if (result?.error) {
      setError("Invalid email or password.")
      setLoading(null)
    }
  }

  async function handleOAuth(provider: "github" | "google") {
    setLoading(provider)
    await signIn(provider, { callbackUrl: "/" })
  }

  return (
    <div className="h-140 bg-[#202123] flex items-center justify-center px-4 font-mono">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8 border-b border-[#2f3133] pb-6">
          <div className="text-[11px] text-[#4b5563] tracking-widest mb-4">
            STATUS // ONLINE
          </div>
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">
            TERMINAL_SHELF
          </h1>
          <p className="text-xs text-[#4b5563] mt-1">
        // authenticate to access your collection
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2 mb-6">
          <button
            onClick={() => handleOAuth("github")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#1a1b1d] text-slate-200 text-xs border border-[#2f3133] hover:border-green-400 hover:text-green-400 transition-colors disabled:opacity-50 cursor-pointer tracking-wide"
          >
            {loading === "github" ? <Spinner light /> : <GitHubIcon />}
            continue with github
          </button>

          <button
            onClick={() => handleOAuth("google")}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#1a1b1d] text-slate-200 text-xs border border-[#2f3133] hover:border-green-400 hover:text-green-400 transition-colors disabled:opacity-50 cursor-pointer tracking-wide"
          >
            {loading === "google" ? <Spinner light /> : <GoogleIcon />}
            continue with google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#2f3133]" />
          <span className="text-[10px] text-[#4b5563] tracking-widest">or</span>
          <div className="flex-1 h-px bg-[#2f3133]" />
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentials} className="space-y-3">
          {[
            { id: "email", label: "email", type: "email", placeholder: "you@example.com", value: email, setter: setEmail },
            { id: "password", label: "password", type: "password", placeholder: "••••••••", value: password, setter: setPassword },
          ].map(({ id, label, type, placeholder, value, setter }) => (
            <div key={id} className="flex items-center gap-3">
              <label htmlFor={id} className="text-[11px] text-[#4b5563] w-20 shrink-0 tracking-wide">
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                required
                className="flex-1 bg-[#16171a] border border-[#2f3133] text-slate-200 text-xs px-2 py-1.5 focus:outline-none focus:border-green-400 placeholder:text-[#374151] transition-colors font-mono"
              />
            </div>
          ))}

          {error && (
            <div className="border-l-2 border-red-500 pl-2 py-1 bg-[#16171a]">
              <p className="text-[11px] text-red-500">// {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!!loading}
            className="w-full mt-2 px-4 py-2 text-xs text-[#1a1b1d] bg-green-400 border border-green-400 hover:bg-green-300 transition-colors disabled:opacity-50 tracking-widest uppercase flex items-center justify-center"
          >
            {loading === "credentials" ? <Spinner light /> : "$ sign in"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-[11px] text-[#4b5563] text-center mt-6">
      // no account?{" "}
          <a href="/register" className="text-green-400 hover:text-green-300 transition-colors">
            create one
          </a>
        </p>

      </div>
    </div>
  )

  function GitHubIcon() {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    )
  }

  function GoogleIcon() {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    )
  }

  function Spinner({ light }: { light?: boolean }) {
    return (
      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={light ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)"} strokeWidth="3" />
        <path d="M22 12a10 10 0 00-10-10" stroke={light ? "white" : "#1a1a1a"} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
}
