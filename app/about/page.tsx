import clsx from "clsx";
import Link from "next/link";

export default function About() {
  return (
    <section className={clsx("p-3", "flex", "justify-center")}>
      <div className={clsx(["flex", "flex-col", "gap-2", "max-w-screen-sm"])}>
        <h2 className={clsx(["text-xl", "font-bold"])}>About</h2>
        <p>
          Muni Routle is a quiz game for testing your knowledge of the Muni
          network. It is inspired by{" "}
          <Link className="underline" href="https://metrodle.com/">
            Metrodle
          </Link>{" "}
          and{" "}
          <Link className="underline" href="https://worldle.teuteuf.fr/">
            Worldle
          </Link>
          . Muni Routle is developed by the mysterious train-loving hacker who
          also made{" "}
          <Link className="underline" href="https://www.munionthego.com/">
            Muni On the Go
          </Link>
          , an app for Muni users who already know where they are going and just
          want to know when they&apos;re going to get there.
        </p>
        <p>
          The Muni Logo is a registered trademark of the{" "}
          <Link className="underline" href="https://www.sfmta.com/terms-of-use">
            San Francisco Municipal Transit Agency
          </Link>
          .
        </p>
        <p>
          The code for Muni Routle is open source and it&apos;s available on{" "}
          <Link
            className="underline"
            href="https://github.com/djbusstop/routle"
          >
            Github
          </Link>
          . Please raise an issue if you see a bug, have a feature request, or
          would like to contribute.
        </p>
      </div>
    </section>
  );
}
