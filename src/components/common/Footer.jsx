import ExternalLink from "./ExternalLink";

export default function Footer() {
  return (
    <footer className="flex flex-row items-center justify-center">
      <p className="text-center">
        Made with 💖 by{" "}
        <ExternalLink href="https://vaibhavacharya.github.io/">
          Vaibhav Acharya
        </ExternalLink>{" "}
        and <ExternalLink href="https://namanvyas.co/">Naman Vyas</ExternalLink>
        .
      </p>
    </footer>
  );
}
