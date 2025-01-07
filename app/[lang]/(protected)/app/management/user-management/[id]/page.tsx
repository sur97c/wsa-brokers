// app/[lang]/(protected)/app/management/user-management/[id]/page.tsx

import UserManagementContent from '@/[lang]/(protected)/app/management/user-management/[id]/UserManagementContent'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const UserManagementPage = async ({ params, searchParams }: Props) => {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ])
  console.log(resolvedParams, resolvedSearchParams)
  return <UserManagementContent id={resolvedParams.id} />
}

export default UserManagementPage
