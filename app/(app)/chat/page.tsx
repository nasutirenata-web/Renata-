import { PageHeader } from "@/components/app/PageHeader";
import { ChatPanel } from "@/components/chat/ChatPanel";

export default function ChatPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Chat" description="Asistente con el contexto del sistema Capsule GTM." />
      <ChatPanel />
    </div>
  );
}
