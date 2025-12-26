import GeoSearch from "@/components/geo/GeoSearch";
import FranceMap from "@/components/map/FranceMap";

const page = () => {
  return (
    <div>
      <div className="flex">
        <div className="w-2/3">
          <div className="text-center text-4xl font-medium uppercase">ou ?</div>
          <GeoSearch />
          <FranceMap />
        </div>
        <div className="w-1/3">other filters</div>
      </div>
    </div>
  );
};

export default page;
