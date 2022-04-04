export default function Logo({ size = 48 }) {
  return (
    <img
      src="/logo.svg"
      alt="logo raterbay"
      loading="lazy"
      decoding="async"
      width={size}
      height={size}
      className="hover:animate-spin"
    />
  );
}
