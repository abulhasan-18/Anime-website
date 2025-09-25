import { google } from "googleapis";

let driveClient: ReturnType<typeof google.drive> | null = null;

export function getDriveClient() {
  if (driveClient) return driveClient;

  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) {
    throw new Error("Google credentials missing in env");
  }

  const auth = new google.auth.JWT({
    email,
    key: key.replace(/\\n/g, "\n"), // normalize \n
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  driveClient = google.drive({ version: "v3", auth });
  return driveClient;
}
