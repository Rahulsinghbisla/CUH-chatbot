import { ChatInterfaceNew } from "@/components/chat-interface";

export default async function Page({
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const { thread_id } = await params;
  console.log("Thread id is ",thread_id)
  return (
    <>
      <ChatInterfaceNew  />
    </>
  );
}
