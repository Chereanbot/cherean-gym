import ClientBlogDetailView from '@/components/client-view/blog/detail'
import CommonLayout from '@/components/client-view/common-layout'

export default function BlogDetail({ params }) {
  return (
    <CommonLayout>
      <ClientBlogDetailView params={params} />
    </CommonLayout>
  )
} 