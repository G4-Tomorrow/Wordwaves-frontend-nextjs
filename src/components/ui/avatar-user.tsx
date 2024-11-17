import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarUser({
  className,
  avatarName,
}: {
  className?: string;
  avatarName: string | null;
}) {
  return (
    <Avatar className={className}>
      <AvatarImage
        className="object-cover"
        src={`${`https://firebasestorage.googleapis.com/v0/b/wordwaves-40814.appspot.com/o/${avatarName}?alt=media&token=e3149c89-093f-4049-a935-5ad0bd42c2ee`}`}
        alt="avatar"
      />
      <AvatarFallback>Null</AvatarFallback>
    </Avatar>
  );
}
