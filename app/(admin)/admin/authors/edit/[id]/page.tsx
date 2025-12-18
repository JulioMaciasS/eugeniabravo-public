import AuthorForm from '@/components/admin/AuthorForm'

interface EditAuthorPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditAuthorPage({ params }: EditAuthorPageProps) {
  const { id } = await params
  return <AuthorForm authorId={id} isEditing={true} />
}
