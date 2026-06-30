import { createHash } from "node:crypto";

/**
 * PayU payment gateway utilities.
 * Server-only — never import from client code.
 */

// ─── URLs ───────────────────────────────────────────────────

const PAYU_URLS = {
  test: "https://test.payu.in/_payment",
  live: "https://secure.payu.in/_payment",
} as const;

export function getPayUUrl(mode: "test" | "live"): string {
  return PAYU_URLS[mode];
}

// ─── Hash Generation ────────────────────────────────────────

/**
 * Generate PayU payment hash.
 *
 * PayU hash formula (forward):
 *   sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 *
 * All empty udf fields must still be represented as empty strings between pipes.
 */
export function generatePayUHash(params: {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  salt: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}): string {
  const hashString = [
    params.key,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 || "",
    params.udf2 || "",
    params.udf3 || "",
    params.udf4 || "",
    params.udf5 || "",
    "", // reserved
    "", // reserved
    "", // reserved
    "", // reserved
    "", // reserved
    params.salt,
  ].join("|");

  return createHash("sha512").update(hashString).digest("hex");
}

/**
 * Verify PayU reverse hash (for callback validation).
 *
 * Reverse hash formula:
 *   sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 *
 * If additionalCharges is present:
 *   sha512(additionalCharges|SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUReverseHash(params: {
  salt: string;
  status: string;
  email: string;
  firstname: string;
  productinfo: string;
  amount: string;
  txnid: string;
  key: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  additionalCharges?: string;
  receivedHash: string;
}): boolean {
  const parts = [
    params.salt,
    params.status,
    "", // reserved
    "", // reserved
    "", // reserved
    "", // reserved
    "", // reserved
    params.udf5 || "",
    params.udf4 || "",
    params.udf3 || "",
    params.udf2 || "",
    params.udf1 || "",
    params.email,
    params.firstname,
    params.productinfo,
    params.amount,
    params.txnid,
    params.key,
  ];

  // If additionalCharges present, prepend it
  if (params.additionalCharges) {
    parts.unshift(params.additionalCharges);
  }

  const hashString = parts.join("|");
  const computed = createHash("sha512").update(hashString).digest("hex");

  return computed === params.receivedHash;
}

/**
 * Get PayU config from environment.
 */
export function getPayUConfig() {
  const key = process.env.PAYU_MERCHANT_KEY || import.meta.env.PAYU_MERCHANT_KEY;
  const salt = process.env.PAYU_SALT || import.meta.env.PAYU_SALT;
  const mode = (process.env.PAYU_MODE || import.meta.env.PAYU_MODE || "test") as "test" | "live";

  if (!key || !salt) {
    throw new Error(
      "[payu] PAYU_MERCHANT_KEY or PAYU_SALT not set. Configure them in your .env file.",
    );
  }

  return { key, salt, mode };
}
