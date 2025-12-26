import GeoSearch from "@/components/geo/GeoSearch";
import ListingsClient from "@/components/inifinte-scroll/ListingsClient";
import FranceMap from "@/components/map/FranceMap";

const page = () => {
  return (
    <div>
      <div className="flex">
        <div className="w-2/3">
          <div className="text-center text-4xl font-medium uppercase">ou ?</div>
          <GeoSearch />
          {/* <FranceMap /> */}
        </div>
        <div className="w-1/3">other filters</div>
      </div>
      <ListingsClient />
    </div>
  );
};

export default page;
