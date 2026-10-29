import SearchExperience from '../../components/search/SearchExperience';

type SearchPageProps = {
  searchParams: Promise<{ origen?: string; destino?: string }>;
};

export default async function BuscarPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  return (
    <SearchExperience
      initialOrigin={params.origen || 'Ciudad Jardín'}
      initialDestination={params.destino || 'Universidad Icesi'}
    />
  );
}
