import ClientBlogView from "@/components/client-view/blog"
import { getData } from "@/services"
import CommonLayout from "@/components/client-view/common-layout"

export default async function Blog() {
  const blogData = await getData("blog")

  return (
    <CommonLayout>
      <ClientBlogView data={blogData?.data || []} />
    </CommonLayout>
  )
} 