interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <div className="container grid items-start gap-8 pb-8 pt-6">
      {children}
    </div>
  )
}
