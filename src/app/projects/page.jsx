'use client'

import { useEffect, useState } from 'react'
import ClientProjectView from "@/components/client-view/project"
import CommonLayout from "@/components/client-view/common-layout"
import { getData } from "@/services"

function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-main"></div>
    </div>
  )
}

export default function Projects() {
  const [projectData, setProjectData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getData('project')
        if (response.success) {
          setProjectData(response.data)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <main>
      <CommonLayout>
        <ClientProjectView data={projectData} />
      </CommonLayout>
    </main>
  )
} 