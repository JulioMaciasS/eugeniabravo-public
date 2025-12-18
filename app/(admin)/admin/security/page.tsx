import MFASetup from '@/components/auth/MFASetup'

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Security Settings</h1>
      <div className="max-w-2xl">
        <MFASetup />
      </div>
    </div>
  )
}
