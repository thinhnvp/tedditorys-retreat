import { config } from "dotenv";
config({ path: ".env.local" });
config();

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const arg of argv) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) out[match[1]] = match[2];
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const siteUrl = process.env.ADMIN_SITE_URL || "https://retreat.tedditory.co";
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) {
    console.error("Set ADMIN_API_TOKEN in .env.local before running this.");
    process.exit(1);
  }

  const url = new URL("/api/admin/inquiries", siteUrl);
  if (args.status) url.searchParams.set("status", args.status);
  if (args.listing) url.searchParams.set("listing", args.listing);
  if (args.limit) url.searchParams.set("limit", args.limit);

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    console.error(json.error || `Request failed (${res.status})`);
    process.exit(1);
  }

  if (json.inquiries.length === 0) {
    console.log("No matching inquiries.");
    return;
  }

  for (const inq of json.inquiries) {
    console.log(
      [
        `[${inq.reference_code}] ${inq.status.toUpperCase()}`,
        `${inq.name} <${inq.email}> ${inq.phone}`,
        `${inq.listing_slug} — ${inq.check_in} to ${inq.check_out} (${inq.guests} guest(s))`,
        inq.message ? `"${inq.message}"` : null,
        inq.amount_cents ? `amount: $${(inq.amount_cents / 100).toFixed(2)}` : null,
        `created ${inq.created_at}`,
      ]
        .filter(Boolean)
        .join("\n  ")
    );
    console.log("");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
