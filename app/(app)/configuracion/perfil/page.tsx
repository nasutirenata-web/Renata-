import { UserRound } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { ConfigTabs } from "@/components/app/ConfigTabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { AvatarUploader } from "@/components/settings/AvatarUploader";
import { getOrgContext } from "@/lib/supabase/org";
import { profileDefaults } from "@/lib/profile";

export default async function PerfilPage() {
  const ctx = await getOrgContext();
  const profile = profileDefaults(ctx?.user.user_metadata);

  return (
    <>
      <PageHeader title="Mi perfil" description="Tus datos: cómo te ve tu equipo y con qué empresa o empresas trabajás." />
      <ConfigTabs active="/configuracion/perfil" />
      <div className="p-8">
        {ctx ? (
          <div className="flex flex-col gap-6">
            <AvatarUploader
              name={[profile.first_name, profile.last_name].filter(Boolean).join(" ")}
              avatarUrl={String(ctx.user.user_metadata?.avatar_url ?? "") || null}
              headline={profile.work_type === "freelance" ? "Freelance" : profile.company}
            />
            <ProfileForm defaults={profile} email={ctx.user.email ?? ""} />
          </div>
        ) : (
          <EmptyState icon={UserRound} title="Iniciá sesión para ver tu perfil" body="Tu perfil se guarda en tu cuenta, por eso hace falta una sesión iniciada." />
        )}
      </div>
    </>
  );
}
