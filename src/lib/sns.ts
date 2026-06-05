import "server-only";
import crypto from "node:crypto";

/**
 * Amazon Pay async notifications (IPN) are delivered as Amazon SNS messages.
 * This verifies the SNS message signature against Amazon's signing certificate
 * before any payload is trusted. Server-only.
 */
export interface SnsMessage {
  Type: string;
  MessageId: string;
  Token?: string;
  TopicArn: string;
  Subject?: string;
  Message: string;
  Timestamp: string;
  SignatureVersion: string;
  Signature: string;
  SigningCertURL: string;
  SubscribeURL?: string;
}

const certCache = new Map<string, string>();

/** The cert must be served over HTTPS from an amazonaws.com SNS host. */
function isValidCertUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /^sns\.[a-z0-9-]+\.amazonaws\.com$/.test(u.hostname);
  } catch {
    return false;
  }
}

function stringToSign(msg: SnsMessage): string {
  const fields: string[] = [];
  const add = (key: string, value?: string) => {
    if (value !== undefined) fields.push(key, value);
  };
  if (msg.Type === "Notification") {
    add("Message", msg.Message);
    add("MessageId", msg.MessageId);
    if (msg.Subject !== undefined) add("Subject", msg.Subject);
    add("Timestamp", msg.Timestamp);
    add("TopicArn", msg.TopicArn);
    add("Type", msg.Type);
  } else {
    // SubscriptionConfirmation | UnsubscribeConfirmation
    add("Message", msg.Message);
    add("MessageId", msg.MessageId);
    add("SubscribeURL", msg.SubscribeURL);
    add("Timestamp", msg.Timestamp);
    add("Token", msg.Token);
    add("TopicArn", msg.TopicArn);
    add("Type", msg.Type);
  }
  return fields.join("\n") + "\n";
}

async function fetchCert(url: string): Promise<string> {
  const cached = certCache.get(url);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`cert fetch ${res.status}`);
  const pem = await res.text();
  certCache.set(url, pem);
  return pem;
}

export async function verifySnsMessage(msg: SnsMessage): Promise<boolean> {
  if (!msg?.Signature || !isValidCertUrl(msg.SigningCertURL)) return false;
  const algorithm = msg.SignatureVersion === "2" ? "RSA-SHA256" : "RSA-SHA1";
  try {
    const cert = await fetchCert(msg.SigningCertURL);
    const verifier = crypto.createVerify(algorithm);
    verifier.update(stringToSign(msg), "utf8");
    return verifier.verify(cert, msg.Signature, "base64");
  } catch {
    return false;
  }
}
