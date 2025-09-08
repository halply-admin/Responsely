import Image from "next/image";

export const ConversationsView = () => {
  return (
    <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
      <div className="flex flex-1 items-center justify-center">
        <Image
          src="/support-image.png"
          alt="Responsely Logo"
          width={200}     // base width
          height={50}     // base height
          className="h-auto w-[150px] sm:w-[200px] lg:w-[240px] object-contain"
          priority
        />
      </div>
    </div>
  );
};
