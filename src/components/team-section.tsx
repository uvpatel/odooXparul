"use server";
import Image from "next/image";

type TeamMember = {
  id: number;
  name: string;
  designation: string;
  image: string;
  bio: string;
  tag: string;
};

export default async function TeamShowcase() {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Urvil Patel",
      designation: "The Founder",
      image:
        "https://www.image2url.com/r2/default/images/1776962033318-b57244e9-647c-4608-b597-64cd7f685453.jpeg",
      bio: "I don't just write code - I design systems that think, scale, and evolve. Every function I create is a decision, every architecture a strategy, and every bug a puzzle waiting to be understood. Technology is my language, logic is my mindset, and building is my instinct.",
      tag: "Founder",
    },
    {
      id: 3,
      name: "Darshan Ajudiya",
      designation: "CTO & Supporter",
      image:
        "https://www.image2url.com/r2/default/images/1776964181383-e5e6c919-3d42-4ead-ab8d-fda131075cf1.jpeg",
      bio: "Drives the technical direction of the team while backing product growth with practical engineering decisions.",
      tag: "Technology",
    },
    {
      id: 4,
      name: "Hiten Bhadiyadra",
      designation: "CFO | Investor",
      image:
        "https://www.image2url.com/r2/default/images/1776962992087-08514c8f-9747-4d90-b7fe-bc9021221f7f.jpeg",
      bio: "Supports the company with financial discipline and investor perspective, helping every bet stay grounded in strategy.",
      tag: "Finance",
    },
    {
      id: 5,
      name: "Krish Ramani",
      designation: "Co-Founder & Supporter",
      image:
        "https://www.image2url.com/r2/default/images/1776964043226-47418bb4-be23-43e0-a0d3-8b8d2777e360.jpeg",
      bio: "Strengthens the foundation of the team through partnership, support, and a strong belief in the mission being built.",
      tag: "Support",
    },
    {
      id: 6,
      name: "Jeet Patel",
      designation: "CPO & Investor",
      image:
        "https://www.image2url.com/r2/default/images/1776963230717-5d060603-7552-4eeb-baa5-fc6ed10131b7.jpeg",
      bio: "Shapes product direction with an investor mindset, balancing user value, market fit, and long-term growth.",
      tag: "Product",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#121212] px-6 py-20 text-white sm:px-8 lg:px-14">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_34%)]" />

      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/45">
            Meet the team
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A team who is not afraid to take risks and bet on themselves.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
            Meet the founders, operators, and supporters moving our mission
            forward with design, technology, and conviction.
          </p>
        </div>

        <div className="mt-14 grid gap-x-7 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member) => (
            <article key={member.id} className="group">
              <div className="rounded-[1.75rem] bg-black/35 p-4 shadow-[10px_10px_0_rgba(0,0,0,0.24)] ring-1 ring-white/5 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="overflow-hidden rounded-[1.2rem] bg-[#161616] ring-1 ring-white/8">
                  {/* ✅ No custom loader — unoptimized handles external URLs directly */}
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={480}
                    height={560}
                    unoptimized
                    className="aspect-[1.08/1] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              </div>

              <div className="mt-4 px-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      {member.name}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-white/54">
                      {member.designation}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/50">
                    {member.tag}
                  </span>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/64">
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}