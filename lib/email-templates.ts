import { formatFriendlyDate } from "./format";

const COLORS = {
  bg: "#FBFBFD",
  card: "#FFFFFF",
  ink: "#1D1D1F",
  muted: "#6E6E73",
  line: "#D8D8DD",
  accent: "#3A6B57",
  cardAlt: "#F5F5F7",
  cta: "#C9A227",
  ctaText: "#3A2E00",
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function money(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** Emails show a single check-in time, not the full arrival window — "3:00 PM–11:00 PM" becomes "3:00 PM". */
function firstTime(time: string): string {
  return time.split(/[-–—]/)[0].trim();
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

/** Subject reused verbatim (with "Re:" on follow-ups) so every email about
 *  this inquiry threads together for guest and host alike. */
export function inquirySubject(data: Pick<InquiryEmailData, "listingName" | "referenceCode">): string {
  return `Your inquiry — ${data.listingName} (ref ${data.referenceCode})`;
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

function button(label: string, url: string): string {
  return `
    <tr>
      <td style="padding:20px 32px 4px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-radius:12px;background:${COLORS.cta};">
              <a href="${url}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:${COLORS.ctaText};font-family:${FONT};text-decoration:none;border-radius:12px;">${label}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

/**
 * The single email sent for a new inquiry — the guest is the primary
 * recipient and the host is CC'd (see sendInquiryEmails), so this content
 * is written for both audiences at once and never includes anything
 * host-only (internal instructions, etc). Replying-all keeps everyone in
 * one thread from here on, including later follow-ups like a payment link.
 */
export function renderInquiryEmail(data: InquiryEmailData): { html: string; text: string } {
  const card = renderDetailsCard([
    [row("Phone", data.guestPhone)],
    [
      row("Check-in", `${formatFriendlyDate(data.checkIn)} · ${firstTime(data.checkInTime)} Pacific Time`),
      row("Check-out", `${formatFriendlyDate(data.checkOut)} · ${data.checkOutTime} Pacific Time`),
      row("Guests", plural(data.guests, "guest")),
    ],
    breakdownRows(data),
    [
      row("Total", money(data.total), { strong: true }),
      data.monthlyAverage !== null ? row("Monthly average", money(data.monthlyAverage)) : "",
    ],
  ]);

  const messageBlock = data.message
    ? paragraph(`&ldquo;${data.message}&rdquo;`, { padBottom: 0 })
    : "";

  const body = [
    paragraph(`Hi ${data.guestName},`, { size: 16, emphasis: true }),
    paragraph(
      `Thanks for reaching out about <strong style="color:${COLORS.ink};">${data.listingName}</strong>. Here&rsquo;s what we received:`,
      { padBottom: 24 }
    ),
    `<tr><td style="padding:0 32px;">${card}</td></tr>`,
    messageBlock,
    paragraph("We&rsquo;ll follow up right here to confirm details and next steps."),
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

  const nightsLine = plural(data.nights, "night");
  const extraGuests = data.guests - 1;
  const textBreakdown = [
    `  ${money(data.nightlyRate)}/night × ${nightsLine} = ${money(data.nightlyRate * data.nights)}`,
    extraGuests > 0
      ? `  +${money(data.guestSurchargePerNight)}/night × ${extraGuests} extra guest × ${nightsLine} = ${money(data.guestSurchargePerNight * data.nights)}`
      : null,
    data.cleaningFee > 0 ? `  Cleaning fee (one-time): ${money(data.cleaningFee)}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const text = [
    `Hi ${data.guestName},`,
    "",
    `Thanks for reaching out about ${data.listingName}. Here's what we received:`,
    "",
    `Phone: ${data.guestPhone}`,
    `Check-in: ${formatFriendlyDate(data.checkIn)} · ${firstTime(data.checkInTime)} Pacific Time`,
    `Check-out: ${formatFriendlyDate(data.checkOut)} · ${data.checkOutTime} Pacific Time`,
    `Guests: ${plural(data.guests, "guest")}`,
    "",
    textBreakdown,
    `Total: ${money(data.total)}`,
    data.monthlyAverage !== null ? `Monthly average: ${money(data.monthlyAverage)}` : null,
    data.message ? `\n"${data.message}"` : null,
    "",
    "We'll follow up right here to confirm details and next steps.",
    "",
    `Reference: ${data.referenceCode}`,
    "",
    "— Tedditory Retreat",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { html, text };
}

export type PaymentLinkEmailData = {
  guestName: string;
  listingName: string;
  checkIn: string;
  checkOut: string;
  checkInTime: string;
  checkOutTime: string;
  guests: number;
  amountCents: number;
  checkoutUrl: string;
  referenceCode: string;
};

/** Sent to the guest (host CC'd) once the host has agreed on a final amount. */
export function renderPaymentLinkEmail(data: PaymentLinkEmailData): { html: string; text: string } {
  const amount = money(data.amountCents / 100);
  const card = renderDetailsCard([
    [
      row("Check-in", `${formatFriendlyDate(data.checkIn)} · ${firstTime(data.checkInTime)} Pacific Time`),
      row("Check-out", `${formatFriendlyDate(data.checkOut)} · ${data.checkOutTime} Pacific Time`),
      row("Guests", plural(data.guests, "guest")),
    ],
    [row("Amount due", amount, { strong: true })],
  ]);

  const body = [
    paragraph(`Hi ${data.guestName},`, { size: 16, emphasis: true }),
    paragraph(
      `Here&rsquo;s a secure link to complete payment and lock in <strong style="color:${COLORS.ink};">${data.listingName}</strong>:`,
      { padBottom: 24 }
    ),
    `<tr><td style="padding:0 32px;">${card}</td></tr>`,
    button("Pay now", data.checkoutUrl),
    paragraph("Payment is handled securely by Stripe.", { padTop: 12, size: 13 }),
    paragraph(`Reference: <strong style="color:${COLORS.ink};">${data.referenceCode}</strong>`, {
      padTop: 8,
      padBottom: 24,
      size: 13,
    }),
  ].join("");

  const html = renderShell({
    preheader: `Complete payment for ${data.listingName} — reference ${data.referenceCode}.`,
    body,
  });

  const text = [
    `Hi ${data.guestName},`,
    "",
    `Here's a secure link to complete payment and lock in ${data.listingName}:`,
    "",
    `Check-in: ${formatFriendlyDate(data.checkIn)} · ${firstTime(data.checkInTime)} Pacific Time`,
    `Check-out: ${formatFriendlyDate(data.checkOut)} · ${data.checkOutTime} Pacific Time`,
    `Guests: ${plural(data.guests, "guest")}`,
    `Amount due: ${amount}`,
    "",
    data.checkoutUrl,
    "",
    "Payment is handled securely by Stripe.",
    "",
    `Reference: ${data.referenceCode}`,
    "",
    "— Tedditory Retreat",
  ].join("\n");

  return { html, text };
}

export type PaymentReceivedEmailData = {
  guestName: string;
  listingName: string;
  checkIn: string;
  checkOut: string;
  checkInTime: string;
  checkOutTime: string;
  guests: number;
  amountCents: number;
  referenceCode: string;
};

/** Sent to the guest (host CC'd) once Stripe confirms the payment cleared. */
export function renderPaymentReceivedEmail(data: PaymentReceivedEmailData): { html: string; text: string } {
  const amount = money(data.amountCents / 100);
  const card = renderDetailsCard([
    [
      row("Check-in", `${formatFriendlyDate(data.checkIn)} · ${firstTime(data.checkInTime)} Pacific Time`),
      row("Check-out", `${formatFriendlyDate(data.checkOut)} · ${data.checkOutTime} Pacific Time`),
      row("Guests", plural(data.guests, "guest")),
    ],
    [row("Amount paid", amount, { strong: true })],
  ]);

  const body = [
    paragraph(`Hi ${data.guestName},`, { size: 16, emphasis: true }),
    paragraph(
      `Payment received &mdash; you&rsquo;re all set for <strong style="color:${COLORS.ink};">${data.listingName}</strong>.`,
      { padBottom: 24 }
    ),
    `<tr><td style="padding:0 32px;">${card}</td></tr>`,
    paragraph("We&rsquo;ll follow up right here with anything else you need before check-in."),
    paragraph(`Reference: <strong style="color:${COLORS.ink};">${data.referenceCode}</strong>`, {
      padTop: 8,
      padBottom: 24,
      size: 13,
    }),
  ].join("");

  const html = renderShell({
    preheader: `Payment received for ${data.listingName} — reference ${data.referenceCode}.`,
    body,
  });

  const text = [
    `Hi ${data.guestName},`,
    "",
    `Payment received — you're all set for ${data.listingName}.`,
    "",
    `Check-in: ${formatFriendlyDate(data.checkIn)} · ${firstTime(data.checkInTime)} Pacific Time`,
    `Check-out: ${formatFriendlyDate(data.checkOut)} · ${data.checkOutTime} Pacific Time`,
    `Guests: ${plural(data.guests, "guest")}`,
    `Amount paid: ${amount}`,
    "",
    "We'll follow up right here with anything else you need before check-in.",
    "",
    `Reference: ${data.referenceCode}`,
    "",
    "— Tedditory Retreat",
  ].join("\n");

  return { html, text };
}
