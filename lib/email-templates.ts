import { formatFriendlyDate } from "./format";

const COLORS = {
  bg: "#FBFBFD",
  card: "#FFFFFF",
  ink: "#1D1D1F",
  muted: "#6E6E73",
  line: "#D8D8DD",
  accent: "#3A6B57",
  cardAlt: "#F5F5F7",
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function money(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function row(label: string, value: string, opts: { strong?: boolean; muted?: boolean } = {}): string {
  const valueWeight = opts.strong ? "700" : "500";
  const valueSize = opts.strong ? "16px" : "14px";
  const valueColor = opts.muted ? COLORS.muted : COLORS.ink;
  return `
    <tr>
      <td style="padding:7px 0;font-size:14px;color:${COLORS.muted};font-family:${FONT};white-space:nowrap;">${label}</td>
      <td style="padding:7px 0 7px 16px;font-size:${valueSize};font-weight:${valueWeight};color:${valueColor};font-family:${FONT};text-align:right;">${value}</td>
    </tr>`;
}

/** Wraps groups of rows in the shared light-grey details card, dividing groups with a rule. */
function renderDetailsCard(groups: string[][]): string {
  const nonEmpty = groups.map((g) => g.filter(Boolean)).filter((g) => g.length > 0);
  const divider = `<div style="border-top:1px solid ${COLORS.line};margin:10px 0;"></div>`;
  const tables = nonEmpty
    .map(
      (rows) => `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${rows.join("")}
      </table>`
    )
    .join(divider);
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cardAlt};border-radius:14px;">
      <tr>
        <td style="padding:18px 20px;">${tables}</td>
      </tr>
    </table>`;
}

function renderShell(opts: { preheader: string; body: string }): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${COLORS.bg};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:${COLORS.card};border:1px solid ${COLORS.line};border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 0 32px;">
                <div style="font-size:17px;font-weight:600;letter-spacing:-0.02em;color:${COLORS.ink};font-family:${FONT};">
                  Tedditory Retreat<span style="color:${COLORS.accent};">.</span>
                </div>
              </td>
            </tr>
            ${opts.body}
            <tr>
              <td style="padding:18px 32px;border-top:1px solid ${COLORS.line};background:${COLORS.bg};">
                <p style="margin:0;font-size:12.5px;color:${COLORS.muted};font-family:${FONT};">
                  Tedditory Retreat · Metro Seattle, WA
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function paragraph(
  text: string,
  opts: { padTop?: number; padBottom?: number; size?: number; emphasis?: boolean } = {}
): string {
  const padTop = opts.padTop ?? 24;
  const padBottom = opts.padBottom ?? 0;
  const size = opts.size ?? 15;
  const color = opts.emphasis ? COLORS.ink : COLORS.muted;
  return `
    <tr>
      <td style="padding:${padTop}px 32px ${padBottom}px 32px;">
        <p style="margin:0;font-size:${size}px;line-height:1.6;color:${color};font-family:${FONT};">${text}</p>
      </td>
    </tr>`;
}

export type InquiryEmailData = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  listingName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  checkInTime: string;
  checkOutTime: string;
  /** Effective nightly rate actually used (after any weekly discount). */
  nightlyRate: number;
  /** Per-night surcharge total for guests beyond the first (0 if solo). */
  guestSurchargePerNight: number;
  cleaningFee: number;
  total: number;
  monthlyAverage: number | null;
  referenceCode: string;
  message?: string | null;
};

function stayRows(data: InquiryEmailData): string[] {
  return [
    row("Check-in", `${formatFriendlyDate(data.checkIn)} · ${data.checkInTime} Pacific Time`),
    row("Check-out", `${formatFriendlyDate(data.checkOut)} · ${data.checkOutTime} Pacific Time`),
    row("Guests", plural(data.guests, "guest")),
  ];
}

function breakdownRows(data: InquiryEmailData): string[] {
  const nightsLine = plural(data.nights, "night");
  const extraGuests = data.guests - 1;
  return [
    row(`${money(data.nightlyRate)}/night × ${nightsLine}`, money(data.nightlyRate * data.nights), { muted: true }),
    extraGuests > 0
      ? row(
          `+${money(data.guestSurchargePerNight)}/night × ${extraGuests} extra guest × ${nightsLine}`,
          money(data.guestSurchargePerNight * data.nights),
          { muted: true }
        )
      : "",
    data.cleaningFee > 0 ? row("Cleaning fee (one-time)", money(data.cleaningFee), { muted: true }) : "",
  ];
}

function totalRows(data: InquiryEmailData): string[] {
  return [
    row("Total", money(data.total), { strong: true }),
    data.monthlyAverage !== null ? row("Monthly average", money(data.monthlyAverage)) : "",
  ];
}

function textStaySection(data: InquiryEmailData): string {
  const extraGuests = data.guests - 1;
  const nightsLine = plural(data.nights, "night");
  return [
    `Check-in: ${formatFriendlyDate(data.checkIn)} · ${data.checkInTime} Pacific Time`,
    `Check-out: ${formatFriendlyDate(data.checkOut)} · ${data.checkOutTime} Pacific Time`,
    `Guests: ${plural(data.guests, "guest")}`,
    "",
    `  ${money(data.nightlyRate)}/night × ${nightsLine} = ${money(data.nightlyRate * data.nights)}`,
    extraGuests > 0
      ? `  +${money(data.guestSurchargePerNight)}/night × ${extraGuests} extra guest × ${nightsLine} = ${money(data.guestSurchargePerNight * data.nights)}`
      : null,
    data.cleaningFee > 0 ? `  Cleaning fee (one-time): ${money(data.cleaningFee)}` : null,
    `Total: ${money(data.total)}`,
    data.monthlyAverage !== null ? `Monthly average: ${money(data.monthlyAverage)}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function renderInquiryConfirmationEmail(data: InquiryEmailData): { html: string; text: string } {
  const card = renderDetailsCard([stayRows(data), breakdownRows(data), totalRows(data)]);

  const body = [
    paragraph(`Hi ${data.guestName},`, { padTop: 24, size: 16, emphasis: true }),
    paragraph(
      `Thanks for reaching out about <strong style="color:${COLORS.ink};">${data.listingName}</strong>. Here&rsquo;s what we received:`,
      { padBottom: 24 }
    ),
    `<tr><td style="padding:0 32px;">${card}</td></tr>`,
    paragraph("Our team will follow up by email or phone soon to confirm details and next steps."),
    paragraph(`Reference: <strong style="color:${COLORS.ink};">${data.referenceCode}</strong>`, {
      padTop: 8,
      padBottom: 24,
      size: 13,
    }),
  ].join("");

  const html = renderShell({
    preheader: `Your inquiry for ${data.listingName} is in — reference ${data.referenceCode}.`,
    body,
  });

  const text = [
    `Hi ${data.guestName},`,
    "",
    `Thanks for reaching out about ${data.listingName}. Here's what we received:`,
    "",
    textStaySection(data),
    "",
    "Our team will follow up by email or phone soon to confirm details and next steps.",
    "",
    `Reference: ${data.referenceCode}`,
    "",
    "— Tedditory Retreat",
  ].join("\n");

  return { html, text };
}

export function renderHostNotificationEmail(data: InquiryEmailData): { html: string; text: string } {
  const contact = [
    row("Guest", data.guestName),
    row("Email", data.guestEmail),
    row("Phone", data.guestPhone),
  ];
  const card = renderDetailsCard([contact, stayRows(data), breakdownRows(data), totalRows(data)]);

  const messageBlock = data.message
    ? paragraph(`&ldquo;${data.message}&rdquo;`, { size: 13, padBottom: 8 })
    : "";

  const body = [
    paragraph(`New inquiry for <strong style="color:${COLORS.ink};">${data.listingName}</strong>.`, {
      padTop: 24,
      padBottom: 24,
      size: 16,
      emphasis: true,
    }),
    `<tr><td style="padding:0 32px;">${card}</td></tr>`,
    messageBlock,
    paragraph("Reply to this email to reach the guest directly.", { padTop: 24 }),
    paragraph(
      `When you&rsquo;re ready to collect payment, tell Claude Code: &ldquo;send a payment link for ${data.referenceCode}, $&lt;amount&gt;&rdquo;.`,
      { padTop: 8 }
    ),
    paragraph(`Reference: <strong style="color:${COLORS.ink};">${data.referenceCode}</strong>`, {
      padTop: 8,
      padBottom: 24,
      size: 13,
    }),
  ].join("");

  const html = renderShell({
    preheader: `New inquiry for ${data.listingName} — reference ${data.referenceCode}.`,
    body,
  });

  const text = [
    `New inquiry: ${data.listingName}`,
    "",
    `Reference: ${data.referenceCode}`,
    `Guest: ${data.guestName}`,
    `Email: ${data.guestEmail}`,
    `Phone: ${data.guestPhone}`,
    "",
    textStaySection(data),
    data.message ? `\nMessage: ${data.message}` : null,
    "",
    "Reply to this email to reach the guest directly.",
    `When you're ready to collect payment, tell Claude Code: "send a payment link for ${data.referenceCode}, $<amount>".`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { html, text };
}
