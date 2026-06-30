import { waterRepo } from "@/features/water/repo";
import { WaterView } from "@/features/water/components/water-view";
import { isIsoDate, todayIso } from "@/lib/iso-date";

export const dynamic = "force-dynamic";

export default async function WaterPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date && isIsoDate(params.date) ? params.date : todayIso();

  const [total, entries] = await Promise.all([
    waterRepo.dailyTotalForDay(date),
    waterRepo.listForDay(date),
  ]);

  return <WaterView date={date} total={total} entries={entries} />;
}
