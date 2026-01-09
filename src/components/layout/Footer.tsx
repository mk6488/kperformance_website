export function Footer() {
  return (
    <footer className="bg-brand-slate text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8 flex flex-col gap-3">
        <div className="text-lg font-semibold">K Performance</div>
        <p className="text-sm text-white/80">Bristol, UK — mobile soft tissue therapy</p>
        <div className="text-sm text-white/80">
          <p>Email: mike@kperformance.uk</p>
        </div>
        <p className="text-sm text-white/70">
          Mobile service available. Safeguarding trained and experienced working with young athletes.
        </p>
        <p className="text-sm text-white/70">Under-18s require consent from a parent or guardian.</p>
        <a
          href="/privacy"
          className="text-sm text-white/70 hover:text-white underline underline-offset-4"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}

export default Footer;



