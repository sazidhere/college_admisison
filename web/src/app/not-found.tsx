import { ArrowLink } from "@/components/ArrowLink";
import { Container } from "@/components/Page";

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="text-6xl">Page not found</h1>
      <div className="mt-8"><ArrowLink href="/">Back to the home page</ArrowLink></div>
    </Container>
  );
}
