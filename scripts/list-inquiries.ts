import { config } from "dotenv";
config({ path: ".env.local" });
config();
import { searchInquiries, type InquiryStatus } from "../lib/db";
import { getListing } from "../lib/listings";

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
  const status = args.status as InquiryStatus | undefined;
  const listingSlug = args.listing;
  const limit = args.limit ? Number(args.limit) : undefined;

  const inquiries = await searchInquiries({ status, listingSlug, limit });

  if (inquiries.length === 0) {
    console.log("No matching inquiries.");
    return;
  }

  for (const inq of inquiries) {
    const listingName = getListing(inq.listing_slug)?.name ?? inq.listing_slug;
    console.log(
      [
        `[${inq.reference_code}] ${inq.status.toUpperCase()}`,
        `${inq.name} <${inq.email}> ${inq.phone}`,
        `${listingName} — ${inq.check_in} to ${inq.check_out} (${inq.guests} guest(s))`,
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
