import ClientServicesView from "@/components/client-view/services"
import { getData } from "@/services"
import CommonLayout from "@/components/client-view/common-layout"

export default async function Services() {
  const servicesData = await getData("services")

  return (
    <CommonLayout>
      <ClientServicesView data={servicesData?.data || []} />
    </CommonLayout>
  )
} 