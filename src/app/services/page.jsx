import ClientServicesView from "@/components/client-view/services"
import { getData } from "@/services"
import CommonLayout from "@/components/client-view/common-layout"

export default async function Services() {
  const servicesData = await getData("services")

  const fetchServices = async () => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/services/get`);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <CommonLayout>
      <ClientServicesView data={servicesData?.data || []} />
    </CommonLayout>
  )
} 