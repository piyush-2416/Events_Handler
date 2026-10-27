import { useSearchParams } from "react-router-dom";

export default function InvitePage() {
  // QR ke link se details nikalo
  const [params] = useSearchParams();
  const event = params.get("event");
  const guest = params.get("guest");
  const date = params.get("date");
  const venue = params.get("venue");

  // Agar link me details nahi hain
  if (!event || !guest) {
    return <p className="p-6 text-center">Invalid invitation.</p>;
  }

  // Date ko padhne layak format me badlo
  const formattedDate = date
    ? new Date(date).toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "";

  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-2xl w-full max-w-sm text-center">
        <p className="text-gray-500">You are invited to</p>
        <h1 className="mt-1 font-semibold text-2xl">{event}</h1>

        <p className="mt-4">Dear {guest},</p>

        <p className="mt-3 text-gray-700">{formattedDate}</p>
        <p className="text-gray-700">{venue}</p>
      </div>
    </div>
  );
}
