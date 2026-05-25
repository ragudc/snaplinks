import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "SnapLinks — Smart URL Shortener with Analytics"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        {/* Logo row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
            }}
          >
            ⚡
          </div>
          <span
            style={{
              color: "white",
              fontSize: "64px",
              fontWeight: "800",
              letterSpacing: "-3px",
            }}
          >
            SnapLinks
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "#9ca3af",
            fontSize: "30px",
            fontWeight: "400",
            textAlign: "center",
            maxWidth: "720px",
            lineHeight: "1.4",
            marginBottom: "52px",
          }}
        >
          Smart URL Shortener with Analytics
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["Edge Speed", "Real Analytics", "Free to Start"].map((feat) => (
            <div
              key={feat}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "100px",
                padding: "10px 24px",
                color: "#e5e7eb",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              {feat}
            </div>
          ))}
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            color: "#4b5563",
            fontSize: "18px",
          }}
        >
          snaplinks.vercel.app
        </div>
      </div>
    ),
    { ...size },
  )
}
