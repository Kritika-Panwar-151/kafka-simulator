export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-24 px-6 max-w-[1100px] mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-12">
        {title}
      </h2>
      {children}
    </section>
  );
}