import { ArrowLink } from "./ArrowLink";
import { Container } from "./Page";

export function NeedProfile({ what }: { what: string }) {
  return (
    <Container className="py-20">
      <div className="max-w-2xl">
        <h2 className="text-4xl sm:text-5xl">Create a profile to see {what}</h2>
        <p className="mt-4 text-lg text-ink/75">It takes about three minutes and it is free.</p>
        <div className="mt-8">
          <ArrowLink href="/signup">Create your profile</ArrowLink>
        </div>
      </div>
    </Container>
  );
}
