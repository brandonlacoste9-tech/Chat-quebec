export default function CheckEmail() {
  return (
    <div className="min-h-screen bg-bark flex items-center justify-center">
      <div className="text-center p-8 bg-bark-l rounded-2xl border border-gold/20 max-w-sm w-full mx-4">
        <div className="text-5xl mb-4">🍁</div>
        <h2 className="font-playfair text-2xl text-gold font-bold mb-2">Check your email!</h2>
        <p className="text-text-dim text-sm font-barlow-cond tracking-wide">
          A magic link is on its way.<br/>Sometimes it ends up in spam — take a look there too.
        </p>
      </div>
    </div>
  )
}
