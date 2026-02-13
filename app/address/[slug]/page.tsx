import { HomeView } from "@/components/home-view"

export default async function DeepLinkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const initialQuery = decodeURIComponent(slug)
  return <HomeView initialQuery={initialQuery} />
}
