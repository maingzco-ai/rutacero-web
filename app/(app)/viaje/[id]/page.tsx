import { notFound } from 'next/navigation';
import TripDetail from '../../../components/trips/TripDetail';
import { getTrip } from '../../../lib/catalog';

type TripPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TripPage({ params }: TripPageProps) {
  const { id } = await params;
  const trip = getTrip(id);
  if (!trip) notFound();
  return <TripDetail trip={trip} />;
}
