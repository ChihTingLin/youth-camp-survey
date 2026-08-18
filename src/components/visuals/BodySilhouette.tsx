export function BodySilhouette() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 220 560"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="body-fill" x1="40" y1="20" x2="180" y2="540">
          <stop stopColor="#F3D7BA" stopOpacity=".78" />
          <stop offset=".55" stopColor="#F2D1AE" stopOpacity=".58" />
          <stop offset="1" stopColor="#E8BE96" stopOpacity=".38" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="55" r="39" fill="url(#body-fill)" />
      <path
        d="M78 105c-25 15-36 54-40 105l-9 108c-2 22 20 27 26 7l16-96 8 113-10 177c-2 28 31 29 35 5l6-143 7 143c3 24 36 23 34-5l-10-177 8-113 16 96c6 20 28 15 26-7l-9-108c-4-51-15-90-40-105-18-11-46-11-64 0Z"
        fill="url(#body-fill)"
      />
      <path
        d="M110 168c-12-18-38-5-31 14 5 13 31 29 31 29s26-16 31-29c7-19-19-32-31-14Z"
        fill="#E58C6B"
        fillOpacity=".9"
      />
      <path d="M110 171c-4 7-4 14 0 22 4-8 4-15 0-22Z" fill="#F7F1E7" fillOpacity=".55" />
    </svg>
  )
}
