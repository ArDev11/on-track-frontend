import { notFound } from "next/navigation";

// Penampung agar tujuan redirect #51 tidak 404. Rute statis halaman asli akan menggantikannya.
const AREAS = ["dashboard", "super-admin", "karyawan", "kasir"];

export default async function AreaPlaceholder({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area } = await params;
  if (!AREAS.includes(area)) notFound();

  return <main>Halaman ini belum dibuat.</main>;
}
