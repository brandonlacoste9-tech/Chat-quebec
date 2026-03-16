'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleLogin = async () => {
    await signIn('email', { email, redirect: false })
    setSent(true)
  }

  if (sent) return (
    <div className="min-h-screen bg-bark flex items-center justify-center">
      <div className="text-center p-8 bg-bark-l rounded-2xl border border-gold/20 max-w-sm w-full mx-4">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="font-playfair text-2xl text-gold font-bold mb-2">Vérifie tes emails!</h2>
        <p className="text-text-dim font-barlow-cond tracking-wide text-sm">
          On t&apos;a envoyé un lien de connexion. Clique dessus pis t&apos;es dans l&apos;app.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bark flex items-center justify-center">
      <div className="p-8 bg-bark-l rounded-2xl border border-gold/20 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center font-playfair text-xl font-black text-bark shadow-lg shadow-gold/10">P</div>
          <div>
            <div className="font-playfair text-lg font-bold text-gold leading-tight">Parlons</div>
            <div className="font-barlow-cond text-[10px] tracking-[3px] text-text-muted uppercase">Quebec AI</div>
          </div>
        </div>

        <h1 className="font-playfair text-2xl font-bold text-text-main mb-1">Join the group</h1>
        <p className="text-text-muted text-sm mb-6 font-barlow-cond tracking-wide">No password needed — just your email.</p>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="your@email.com"
          className="w-full bg-bark border border-border-parlons rounded-xl px-4 py-3 text-text-main placeholder-text-dim outline-none focus:border-gold/45 mb-3 text-sm transition-colors"
        />

        <button
          onClick={handleLogin}
          disabled={!email.includes('@')}
          className="w-full bg-gold hover:bg-gold-l text-bark font-barlow-cond font-bold tracking-[0.2em] text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-gold/10 hover:shadow-gold/20 disabled:opacity-30 disabled:cursor-not-allowed uppercase"
        >
          Send Magic Link
        </button>

        <p className="text-center text-text-dim text-xs mt-6 font-barlow-cond tracking-wide leading-relaxed">
          By continuing, you agree to our <br/>
          <span className="text-text-muted underline decoration-gold/30 cursor-pointer">Terms of Use</span>.
        </p>
      </div>
    </div>
  )
}
