import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const value = new URL(request.url).searchParams.get("size");
  const size = value === "192" ? 192 : 512;
  const avatar = new URL("/nebu-avatar.webp", request.url).toString();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#100e17",
      }}
    >
      <div
        style={{
          width: "84%",
          height: "84%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "#cbb98f",
          border: `${Math.max(4, Math.round(size * 0.018))}px solid #d4b76d`,
          overflow: "hidden",
        }}
      >
        <img src={avatar} width={Math.round(size * 0.84)} height={Math.round(size * 0.84)} style={{ objectFit: "cover" }} />
      </div>
    </div>,
    { width: size, height: size }
  );
}
