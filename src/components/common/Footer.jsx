import GitHubButton from "react-github-btn";
import ExternalLink from "./ExternalLink";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-end gap-2">
      <p className="text-center">
        Made with 💖 by{" "}
        <ExternalLink href="https://vaibhavacharya.github.io/">
          Vaibhav Acharya
        </ExternalLink>{" "}
        and <ExternalLink href="https://namanvyas.co/">Naman Vyas</ExternalLink>
        .
      </p>

      <a
        rel="noopener noreferrer"
        href="https://www.producthunt.com/posts/raterbay?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-raterbay"
        target="_blank"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=345565&theme=light"
          alt="Raterbay - A&#0032;platform&#0032;for&#0032;receiving&#0032;and&#0032;providing&#0032;resume&#0032;reviews&#0046; | Product Hunt"
          width={120}
          height={60}
        />
      </a>

      <GitHubButton
        rel="noopener noreferrer"
        href="https://github.com/vaibhavacharya/raterbay"
        data-size="small"
        data-show-count="true"
        aria-label="Star vaibhavacharya/raterbay on GitHub"
      >
        Star
      </GitHubButton>
    </footer>
  );
}
