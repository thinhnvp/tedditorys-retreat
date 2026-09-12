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

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export type InquiryConfirmationData = {
  guestName: string;
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
};

export function renderInquiryConfirmationEmail(data: InquiryConfirmationData): { html: string; text: string } {
  const guestLine = plural(data.guests, "guest");
  const nightsLine = plural(data.nights, "night");
  const extraGuests = data.guests - 1;

  const breakdownRows = [
    row(
      `${money(data.nightlyRate)}/night × ${nightsLine}`,
      money(data.nightlyRate * data.nights),
      { muted: true }
    ),
    extraGuests > 0
      ? row(
          `+${money(data.guestSurchargePerNight)}/night × ${extraGuests} extra guest × ${nightsLine}`,
          money(data.guestSurchargePerNight * data.nights),
          { muted: true }
        )
      : "",
    data.cleaningFee > 0 ? row("Cleaning fee (one-time)", money(data.cleaningFee), { muted: true }) : "",
  ].join("");

  const monthlyAverageRow =
    data.monthlyAverage !== null ? row("Monthly average", money(data.monthlyAverage)) : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${COLORS.bg};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Your inquiry for ${data.listingName} is in — reference ${data.referenceCode}.
    </div>
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
            <tr>
              <td style="padding:24px 32px 0 32px;">
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:${COLORS.ink};font-family:${FONT};">
                  Hi ${data.guestName},
                </p>
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:${COLORS.muted};font-family:${FONT};">
                  Thanks for reaching out about <strong style="color:${COLORS.ink};">${data.listingName}</strong>. Here&rsquo;s what we received:
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cardAlt};border-radius:14px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${row("Check-in", `${formatFriendlyDate(data.checkIn)} · ${data.checkInTime} Pacific Time`)}
                        ${row("Check-out", `${formatFriendlyDate(data.checkOut)} · ${data.checkOutTime} Pacific Time`)}
                        ${row("Guests", guestLine)}
                      </table>
                      <div style="border-top:1px solid ${COLORS.line};margin:10px 0;"></div>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${breakdownRows}
                      </table>
                      <div style="border-top:1px solid ${COLORS.line};margin:10px 0;"></div>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${row("Total", money(data.total), { strong: true })}
                        ${monthlyAverageRow}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0 32px;">
                <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:${COLORS.muted};font-family:${FONT};">
                  Our team will follow up by email or phone soon to confirm details and next steps.
                </p>
                <p style="margin:0 0 24px 0;font-size:13px;color:${COLORS.muted};font-family:${FONT};">
                  Reference: <strong style="color:${COLORS.ink};">${data.referenceCode}</strong>
                </p>
              </td>
            </tr>
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
    `Check-in: ${formatFriendlyDate(data.checkIn)} · ${data.checkInTime} Pacific Time`,
    `Check-out: ${formatFriendlyDate(data.checkOut)} · ${data.checkOutTime} Pacific Time`,
    `Guests: ${guestLine}`,
    "",
    textBreakdown,
    `Total: ${money(data.total)}`,
    data.monthlyAverage !== null ? `Monthly average: ${money(data.monthlyAverage)}` : null,
    "",
    "Our team will follow up by email or phone soon to confirm details and next steps.",
    "",
    `Reference: ${data.referenceCode}`,
    "",
    "— Tedditory Retreat",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { html, text };
}
