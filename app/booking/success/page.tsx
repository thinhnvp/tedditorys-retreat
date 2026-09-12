import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = { title: "Payment received", robots: { index: false } };

export default async function BookingSuccessPage({
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
          <h1>You&apos;re all set 🎉</h1>
          <p>Thanks — your payment went through. Our team will follow up shortly to confirm the details of your stay.</p>
          {ref && <div className="ref">Reference: {ref}</div>}
        </div>
      </div>
      <Footer />
    </>
  );
}
