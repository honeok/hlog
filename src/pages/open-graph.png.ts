// Generates the shared Open Graph image during the static build.
import sharp from "sharp";

export async function GET() {
  const image = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: "#fcfcfc",
    },
  })
    .png({ palette: true })
    .toBuffer();

  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/png" },
  });
}
