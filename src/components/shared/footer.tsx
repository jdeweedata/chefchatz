export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ChefChatz. All rights reserved.
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="/privacy" className="hover:text-foreground">
            Privacy
          </a>
          <a href="/terms" className="hover:text-foreground">
            Terms
          </a>
          <a href="/about" className="hover:text-foreground">
            About
          </a>
        </nav>
      </div>
    </footer>
  )
}
