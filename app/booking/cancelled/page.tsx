import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = { title: "Checkout cancelled", robots: { index: false } };

export default async function BookingCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <>
      <NavBar />
      <div className="status-page">
        <div>
          <h1>Checkout cancelled</h1>
          <p>No worries — nothing was charged. Reply to our email whenever you&apos;re ready to try again.</p>
          {ref && <div className="ref">Reference: {ref}</div>}
        </div>
      </div>
      <Footer />
    </>
  );
}
