# Claude connector (MCP) & Marketing

The admin portal exposes an MCP server so Claude can operate it: review requests,
reply to clients (through your Gmail connector), manage bookings, quotes/invoices,
accounts, equipment, follow-ups, and run email marketing and ad tracking in the
**Marketing** section.

## One-time setup

1. **Database** — in Supabase → SQL Editor, run `supabase/marketing.sql`.
   It is safe to run more than once.
2. **Secret key** — generate one:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Add it to your hosting environment as `MCP_SECRET_KEY` (and make sure
   `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SITE_URL` are set). Redeploy.
3. **Connect Claude** — in Claude: *Settings → Connectors → Add custom connector*.
   - Name: `VR Guys Portal`
   - URL: `https://virtualrealityguyz.co.za/api/mcp/<MCP_SECRET_KEY>`

   Keep the Gmail connector enabled too, so Claude can send what it writes.

   Claude Code / other MCP clients can instead use `https://virtualrealityguyz.co.za/api/mcp`
   with the header `Authorization: Bearer <MCP_SECRET_KEY>`.

The URL contains the key, so treat it like a password. To revoke access, change
or delete `MCP_SECRET_KEY` and redeploy.

## What Claude can do (48 tools)

| Area | Tools |
| --- | --- |
| Overview | `get_business_overview`, `get_business_knowledge`, `list_team`, `list_audit_log` |
| Requests | `list_requests`, `get_request` (incl. history, past emails, date availability), `update_request`, `log_client_email`, `list_client_communications`, `get_customer_history` |
| Bookings | `list_bookings`, `check_availability`, `create_event`, `update_event` |
| Quotes & invoices | `list_invoices`, `get_invoice`, `get_unpaid_invoices`, `create_quote_or_invoice`, `update_invoice` |
| Accounts | `get_financial_summary`, `list_expenses`, `create_expense` |
| Equipment & rentals | `get_equipment_status`, `update_equipment`, `log_equipment_issue`, `list_rental_agreements`, `get_rental_agreement`, `update_rental_agreement_status` |
| Follow-ups | `list_follow_ups`, `create_follow_up`, `update_follow_up` |
| Marketing | `get_marketing_report`, contacts (`list_/add_/update_marketing_contact(s)`, `unsubscribe_contact`, `sync_contacts_from_clients`), email campaigns (`list_/get_/create_/update_email_campaign`, `prepare_campaign_recipients`, `get_campaign_send_batch`, `record_campaign_sends`, `send_campaign_batch_via_portal`), ads (`list_/create_/update_ad_campaign`) |

Hard deletes are deliberately not exposed to Claude — delete from the portal UI.
Every change Claude makes is written to the **AI Audit Log** with actor `Claude (MCP)`.

## Example prompts

- "Check new requests in the VR Guys portal, reply to each one from Gmail and log it."
- "Create a quote for request <name> — Standard Package plus R250 transport."
- "Import our past clients as contacts, then write a December holiday-party email for
  birthday and past-client contacts and send it through Gmail."
- "Log our Meta ad for kids parties: R1,240 spent, 980 clicks, 31 leads, 5 bookings."

## Email marketing rules built in

- Only `subscribed` contacts are emailed; unsubscribed people are never re-added automatically.
- Every marketing email gets a personal unsubscribe link (`/api/marketing/unsubscribe`).
  Opening the link shows a confirm button, so email link-scanners can't unsubscribe people.
- Personal Gmail sends roughly 500 emails/day. For bigger lists, set `RESEND_API_KEY`
  (or Gmail SMTP `GMAIL_APP_PASSWORD`) and use "Send next batch from portal".
- POPIA: past clients/enquirers can be emailed about similar services if every email lets
  them opt out (built in). For anyone else, add them only with their consent (`opt_in`).
