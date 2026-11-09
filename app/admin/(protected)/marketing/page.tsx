"use client"

import { useEffect, useState } from "react"
import { Megaphone, Mail, Users, BarChart3, Inbox, Bot, RefreshCw, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CampaignsTab } from "@/components/admin/marketing/CampaignsTab"
import { ContactsTab } from "@/components/admin/marketing/ContactsTab"
import { AdsTab } from "@/components/admin/marketing/AdsTab"
import { api, zar, fmtDateTime, Kpi, StatusPill, ActorBadge, EmptyState } from "@/components/admin/marketing/shared"

export default function MarketingPage() {
  const [report, setReport] = useState<any>(null)
  const [tab, setTab] = useState("overview")

  const loadReport = async () => {
    try {
      setReport(await api("/api/marketing/report"))
    } catch (e: any) {
      toast.error(
        /marketing_contacts|email_campaigns|ad_campaigns|relation/i.test(e.message)
          ? "Marketing tables not found — run supabase/marketing.sql in Supabase first."
          : e.message
      )
    }
  }

  useEffect(() => {
    loadReport()
  }, [])

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-primary" />
            Marketing
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Email marketing, ad campaigns and client emails, managed by you or by Claude
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadReport} className="text-xs self-start sm:self-auto">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="overflow-x-auto -mx-1 px-1">
          <TabsList>
            <TabsTrigger value="overview" className="text-xs gap-1.5"><BarChart3 className="w-3.5 h-3.5" />Overview</TabsTrigger>
            <TabsTrigger value="email" className="text-xs gap-1.5"><Mail className="w-3.5 h-3.5" />Email campaigns</TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs gap-1.5"><Users className="w-3.5 h-3.5" />Contacts</TabsTrigger>
            <TabsTrigger value="ads" className="text-xs gap-1.5"><Megaphone className="w-3.5 h-3.5" />Ads</TabsTrigger>
            <TabsTrigger value="log" className="text-xs gap-1.5"><Inbox className="w-3.5 h-3.5" />Client emails</TabsTrigger>
            <TabsTrigger value="claude" className="text-xs gap-1.5"><Bot className="w-3.5 h-3.5" />Claude connector</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-4">
          <Overview report={report} onGo={setTab} />
        </TabsContent>
        <TabsContent value="email" className="mt-4">
          <CampaignsTab provider={report?.portal_email_provider ?? null} onChanged={loadReport} />
        </TabsContent>
        <TabsContent value="contacts" className="mt-4">
          <ContactsTab onChanged={loadReport} />
        </TabsContent>
        <TabsContent value="ads" className="mt-4">
          <AdsTab onChanged={loadReport} />
        </TabsContent>
        <TabsContent value="log" className="mt-4">
          <ClientEmailLog />
        </TabsContent>
        <TabsContent value="claude" className="mt-4">
          <ConnectorSetup report={report} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Overview({ report, onGo }: { report: any; onGo: (t: string) => void }) {
  if (!report) return <p className="text-sm text-muted-foreground py-8 text-center">Loading marketing data…</p>
  const { contacts, email, ads } = report
  const platforms = Object.entries(ads.by_platform || {}) as [string, any][]
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Subscribed contacts" value={contacts.by_status?.subscribed || 0} hint={`${contacts.total} total · ${contacts.by_status?.unsubscribed || 0} unsubscribed`} />
        <Kpi label="Marketing emails sent" value={email.emails_sent} hint={`${email.campaigns} campaigns · ${email.replies} replies`} />
        <Kpi label="Ad spend" value={zar(ads.spend_zar)} hint={`${ads.active} active · budget ${zar(ads.budget_zar)}`} />
        <Kpi
          label="Bookings from marketing"
          value={email.bookings + ads.bookings}
          hint={`${zar(email.revenue_attributed_zar + ads.revenue_attributed_zar)} revenue`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2"><Mail className="w-4 h-4 text-primary" />Email marketing</h2>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => onGo("email")}>Open</Button>
          </div>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Campaigns sent</dt><dd className="text-right tabular-nums">{email.sent_campaigns}</dd>
            <dt className="text-muted-foreground">Emails sent</dt><dd className="text-right tabular-nums">{email.emails_sent}</dd>
            <dt className="text-muted-foreground">Replies</dt><dd className="text-right tabular-nums">{email.replies}</dd>
            <dt className="text-muted-foreground">Bookings</dt><dd className="text-right tabular-nums">{email.bookings}</dd>
            <dt className="text-muted-foreground">Revenue</dt><dd className="text-right tabular-nums">{zar(email.revenue_attributed_zar)}</dd>
            <dt className="text-muted-foreground">Cost</dt><dd className="text-right tabular-nums">{zar(email.cost_zar)}</dd>
          </dl>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground flex items-center gap-2"><Megaphone className="w-4 h-4 text-primary" />Ads</h2>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => onGo("ads")}>Open</Button>
          </div>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Spend</dt><dd className="text-right tabular-nums">{zar(ads.spend_zar)}</dd>
            <dt className="text-muted-foreground">Clicks</dt><dd className="text-right tabular-nums">{ads.clicks.toLocaleString()}</dd>
            <dt className="text-muted-foreground">Leads</dt><dd className="text-right tabular-nums">{ads.leads}</dd>
            <dt className="text-muted-foreground">Cost per lead</dt><dd className="text-right tabular-nums">{ads.cost_per_lead_zar !== null ? zar(ads.cost_per_lead_zar) : "—"}</dd>
            <dt className="text-muted-foreground">Bookings</dt><dd className="text-right tabular-nums">{ads.bookings}</dd>
            <dt className="text-muted-foreground">Return on ad spend</dt><dd className="text-right tabular-nums">{ads.roas !== null ? `${ads.roas}×` : "—"}</dd>
          </dl>
          {platforms.length > 0 && (
            <div className="pt-2 border-t border-border space-y-1.5">
              {platforms.map(([p, v]) => (
                <div key={p} className="flex justify-between text-xs">
                  <span className="text-muted-foreground capitalize">{p}</span>
                  <span className="tabular-nums">{zar(v.spend)} · {v.leads} leads · {v.bookings} bookings</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Marketing expenses recorded in Accounts: <span className="text-foreground font-medium">{zar(report.marketing_expenses_in_accounts_zar)}</span>
      </p>
    </div>
  )
}

function ClientEmailLog() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await api("/api/marketing/communications?limit=200")
      setItems(data.communications || [])
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <p className="text-sm text-muted-foreground py-8 text-center">Loading…</p>
  if (!items.length)
    return <EmptyState icon={Inbox} title="No client emails logged yet" body="When Claude replies to a request through Gmail, the email is recorded here and linked to the request." />

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={load} className="text-xs"><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh</Button>
      </div>
      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        {items.map((c) => (
          <div key={c.id} className="p-4">
            <button className="w-full text-left" onClick={() => setOpenId(openId === c.id ? null : c.id)}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">{c.direction === "inbound" ? "From" : "To"}</span>
                <span className="font-medium text-foreground text-sm">{c.client_name || c.client_email}</span>
                {c.client_name && <span className="text-xs text-muted-foreground">{c.client_email}</span>}
                <StatusPill status={c.status} />
                <ActorBadge actor={c.sent_by} />
                <span className="text-xs text-muted-foreground ml-auto">{fmtDateTime(c.created_at)}</span>
              </div>
              <p className="text-sm text-foreground mt-1">{c.subject || "(no subject)"}</p>
            </button>
            {openId === c.id && (
              <pre className="mt-3 whitespace-pre-wrap text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 font-sans">{c.body}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ConnectorSetup({ report }: { report: any }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://virtualrealityguyz.co.za"
  const configured = report?.mcp_configured
  const provider = report?.portal_email_provider
  return (
    <div className="space-y-4 max-w-3xl">
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-foreground flex items-center gap-2"><Bot className="w-4 h-4 text-primary" />Connect Claude to this portal</h2>
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            {configured ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
            Connector {configured ? "enabled" : "not enabled (MCP_SECRET_KEY missing)"}
          </span>
          <span className="flex items-center gap-1.5">
            {provider ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
            Portal email sending: {provider ? provider : "not set up (Claude will send through Gmail)"}
          </span>
        </div>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
          <li>
            In your hosting settings (e.g. Vercel → Project → Settings → Environment Variables) add{" "}
            <code className="font-mono text-xs text-foreground">MCP_SECRET_KEY</code> with a long random value (at least 32 characters), then redeploy. Treat it like a password.
          </li>
          <li>
            In Claude go to <strong className="text-foreground">Settings → Connectors → Add custom connector</strong>, name it “VR Guys Portal” and use this URL:
            <code className="block mt-1.5 p-2 rounded bg-muted text-foreground font-mono text-xs break-all">{origin}/api/mcp/&lt;your MCP_SECRET_KEY&gt;</code>
          </li>
          <li>Make sure the Gmail connector is also enabled in Claude, so Claude can send the emails it writes.</li>
          <li>
            Try: <em className="text-foreground">“Check new requests in the VR Guys portal, draft a reply for each and send them from Gmail.”</em>
          </li>
        </ol>
        <p className="text-xs text-muted-foreground">
          Claude Code / Desktop can also use <code className="font-mono">{origin}/api/mcp</code> with the header <code className="font-mono">Authorization: Bearer &lt;MCP_SECRET_KEY&gt;</code>.
          Everything Claude does is recorded in the AI Audit Log as “Claude (MCP)”. To cut off access, change or remove the key.
        </p>
      </div>
    </div>
  )
}
