import { formatDateRange } from "./format";

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

function row(label: string, value: string, opts: { strong?: boolean } = {}): string {
  const valueWeight = opts.strong ? "700" : "500";
  const valueSize = opts.strong ? "16px" : "14px";
  return `
    <tr>
      <td style="padding:7px 0;font-size:14px;color:${COLORS.muted};font-family:${FONT};white-space:nowrap;">${label}</td>
      <td style="padding:7px 0 7px 16px;font-size:${valueSize};font-weight:${valueWeight};color:${COLORS.ink};font-family:${FONT};text-align:right;">${value}</td>
    </tr>`;
}

export type InquiryConfirmationData = {
  guestName: string;
  listingName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  checkInTime: string;
  checkOutTime: string;
  total: number;
  monthlyAverage: number | null;
  referenceCode: string;
};

export function renderInquiryConfirmationEmail(data: InquiryConfirmationData): { html: string; text: string } {
  const dateRange = formatDateRange(data.checkIn, data.checkOut);
  const guestLine = `${data.guests} guest${data.guests === 1 ? "" : "s"}`;

  const monthlyAverageRow =
    data.monthlyAverage !== null ? row("Monthly average", `${money(data.monthlyAverage)}`) : "";

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
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cardAlt};border-radius:14px;padding:18px 20px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        ${row("Dates", dateRange)}
                        ${row("Guests", guestLine)}
                        ${row("Check-in", `${data.checkInTime} Pacific Time`)}
                        ${row("Check-out", `${data.checkOutTime} Pacific Time`)}
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
                  This quote is direct with us, not through Airbnb. Our team will follow up by email or phone soon to confirm details and next steps.
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

  const text = [
    `Hi ${data.guestName},`,
    "",
    `Thanks for reaching out about ${data.listingName}. Here's what we received:`,
    "",
    `Dates: ${dateRange}`,
    `Guests: ${guestLine}`,
    `Check-in: ${data.checkInTime} Pacific Time`,
    `Check-out: ${data.checkOutTime} Pacific Time`,
    `Total: ${money(data.total)}`,
    data.monthlyAverage !== null ? `Monthly average: ${money(data.monthlyAverage)}` : null,
    "",
    "This quote is direct with us, not through Airbnb. Our team will follow up by email or phone soon to confirm details and next steps.",
    "",
    `Reference: ${data.referenceCode}`,
    "",
    "— Tedditory Retreat",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { html, text };
}
