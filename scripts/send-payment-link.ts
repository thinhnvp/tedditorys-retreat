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
  const ref = args.ref;
  const amount = args.amount ? Number(args.amount) : NaN;

  if (!ref) {
    console.error("Usage: npm run inquiries:send-payment-link -- --ref=ABC123 --amount=1400");
    process.exit(1);
  }
  if (!amount || amount <= 0) {
    console.error("Provide a positive --amount in dollars, e.g. --amount=1400");
    process.exit(1);
  }

  const siteUrl = process.env.ADMIN_SITE_URL || "https://retreat.tedditory.co";
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) {
    console.error("Set ADMIN_API_TOKEN in .env.local before running this.");
    process.exit(1);
  }

  const res = await fetch(new URL("/api/admin/payment-link", siteUrl), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ref, amount }),
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    console.error(json.error || `Request failed (${res.status})`);
    process.exit(1);
  }

  console.log(`Sent $${amount.toFixed(2)} payment link to ${json.guest} <${json.email}>.`);
  console.log(`Checkout URL: ${json.checkoutUrl}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
