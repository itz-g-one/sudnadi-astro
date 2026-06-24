import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { verifyPayUPayment } from "@/lib/api/payment.functions";
import { z } from "zod";

/**
 * PayU callback route.
 *
 * After PayU processes the payment, it redirects the browser to this URL
 * with payment parameters as query strings (GET redirect from PayU's page).
 *
 * Flow:
 *   1. User pays on PayU → PayU redirects to /api/payu-callback?status=...&txnid=...
 *   2. This page renders a "Verifying..." spinner
 *   3. useEffect fires the verifyPayUPayment server function
 *   4. On result, we navigate to /order-success or /order-failure
 */

const callbackSearch = z.object({
  mihpayid: z.string().optional(),
  status: z.string().optional(),
  txnid: z.string().optional(),
  amount: z.string().optional(),
  productinfo: z.string().optional(),
  firstname: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  hash: z.string().optional(),
  key: z.string().optional(),
  error: z.string().optional(),
  error_Message: z.string().optional(),
  udf1: z.string().optional(),
  udf2: z.string().optional(),
  udf3: z.string().optional(),
  udf4: z.string().optional(),
  udf5: z.string().optional(),
  additionalCharges: z.string().optional(),
}).passthrough();

export const Route = createFileRoute("/api/payu-callback")({
  validateSearch: callbackSearch,
  head: () => ({
    meta: [{ title: "Processing payment — Astrosuman" }, { name: "robots", content: "noindex" }],
  }),
  component: PayUCallbackPage,
});

function PayUCallbackPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have no payment data in the URL, just redirect to home
    if (!search.txnid || !search.status) {
      navigate({ to: "/", replace: true });
      return;
    }

    async function processCallback() {
      try {
        const result = await verifyPayUPayment({
          data: {
            mihpayid: search.mihpayid ?? "",
            status: search.status ?? "",
            txnid: search.txnid ?? "",
            amount: search.amount ?? "",
            productinfo: search.productinfo ?? "",
            firstname: search.firstname ?? "",
            email: search.email ?? "",
            phone: search.phone,
            hash: search.hash ?? "",
            key: search.key ?? "",
            error: search.error,
            error_Message: search.error_Message,
            udf1: search.udf1,
            udf2: search.udf2,
            udf3: search.udf3,
            udf4: search.udf4,
            udf5: search.udf5,
            additionalCharges: search.additionalCharges,
          },
        });

        if (result.paymentStatus === "success" || result.status === "already_processed") {
          navigate({
            to: "/order-success",
            search: { ref: result.publicRef },
            replace: true,
          });
        } else {
          navigate({
            to: "/order-failure",
            search: { ref: result.publicRef },
            replace: true,
          });
        }
      } catch (err) {
        console.error("[payu-callback] Verification failed:", err);
        const ref = search.udf1 || "";
        setError("Payment verification failed. Redirecting...");
        setTimeout(() => {
          navigate({
            to: "/order-failure",
            search: { ref, error: "verification_failed" },
            replace: true,
          });
        }, 2000);
      }
    }

    processCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-dvh flex items-center justify-center bg-cream">
      <div className="text-center max-w-sm px-5">
        {error ? (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 text-red-500 inline-flex items-center justify-center text-2xl">
              !
            </div>
            <p className="mt-4 font-display text-xl text-indigo-deep">{error}</p>
          </>
        ) : (
          <>
            <div className="mx-auto w-14 h-14 border-4 border-saffron border-t-transparent rounded-full animate-spin" />
            <p className="mt-5 font-display text-xl text-indigo-deep">
              Verifying your payment…
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Please do not close this page. You'll be redirected shortly.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
