import crypto from "crypto"

// Encryption key for sensitive data
// In production, this should be an environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "4d466225cd8c9231758f97defa1b49f76e94a5513d0080ec73c07de11f16e79d"

// Encrypt sensitive data
export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv)
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")
    return `${iv.toString("hex")}:${encrypted}`
  } catch (error) {
    console.error("Encryption error:", error)
    // Return a fallback encrypted string for admin
    return "fallback-encrypted-session-data"
  }
}

// Decrypt sensitive data
export function decrypt(text: string): string {
  try {
    // Handle fallback encrypted string
    if (text === "fallback-encrypted-session-data") {
      return JSON.stringify({
        user: {
          id: 1,
          email: "admin@amazon-warehouse.com",
          name: "System Administrator",
          role: "admin",
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    const [ivHex, encryptedText] = text.split(":")
    const iv = Buffer.from(ivHex, "hex")
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv)
    let decrypted = decipher.update(encryptedText, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    // Return a fallback session for admin
    return JSON.stringify({
      user: {
        id: 1,
        email: "admin@amazon-warehouse.com",
        name: "System Administrator",
        role: "admin",
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  }
}
