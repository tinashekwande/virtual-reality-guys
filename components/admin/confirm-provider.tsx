"use client"

import { createContext, useCallback, useContext, useRef, useState } from "react"
import { ConfirmDialog } from "./confirm-dialog"

export interface ConfirmOptions {
  title?: string
  description?: string
  confirmLabel?: string
  destructive?: boolean
}

type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn>(async () => window.confirm("Are you sure?"))

/** Promise-based confirmation dialog, a drop-in replacement for window.confirm(). */
export function useConfirm(): ConfirmFn {
  return useContext(ConfirmContext)
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmOptions & { open: boolean }>({ open: false })
  const resolver = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback<ConfirmFn>((options = {}) => {
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
      setState({ open: true, ...options })
    })
  }, [])

  const settle = (value: boolean) => {
    setState((s) => ({ ...s, open: false }))
    resolver.current?.(value)
    resolver.current = null
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={state.open}
        title={state.title}
        description={state.description}
        confirmLabel={state.confirmLabel}
        destructive={state.destructive ?? true}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
      />
    </ConfirmContext.Provider>
  )
}
