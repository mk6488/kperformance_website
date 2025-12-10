export function Footer() {
  return (
    <footer className="bg-brand-slate text-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-8 flex flex-col gap-3">
        <div className="text-lg font-semibold">K Performance</div>
        <p className="text-sm text-white/80">Bristol, UK — mobile soft tissue therapy</p>
        <div className="text-sm text-white/80">
          <p>Email: hello@kperformance.co.uk</p>
          <p>Phone: 07123 456789</p>
        </div>
        <p className="text-sm text-white/70">
          Mobile service available. Safeguarding trained and experienced with young athletes.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
