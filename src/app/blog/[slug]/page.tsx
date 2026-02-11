export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <section className="py-10"><h1 className="text-3xl font-bold">Blog: {slug}</h1></section>;
}
