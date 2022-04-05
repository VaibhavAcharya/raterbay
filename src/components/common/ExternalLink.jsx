export default function ExternalLink({
  href = "",
  className = "",
  children,
  ...otherProps
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={["font-bold", className].join(" ")}
      {...otherProps}
    >
      {children}
    </a>
  );
}
