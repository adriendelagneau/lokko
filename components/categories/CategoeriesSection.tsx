import Link from "next/link";
import { PiFlowerTulipDuotone, PiCheese } from "react-icons/pi";
import { TbApple } from "react-icons/tb";
import { PiPlant } from "react-icons/pi";
import { TbEggs } from "react-icons/tb";
import { IoFishOutline } from "react-icons/io5";

const categories = [
  {
    title: "Poissons",
    icon: IoFishOutline,
    link: "/search?category=produits-animaux&subCategory=poisson",
  },
  {
    title: "Plantes et semis",
    icon: PiPlant,
    link: "/search?category=jardin-plants&subCategory=plants-semis",
  },
  {
    title: "Fromages",
    icon: PiCheese,
    link: "/search?category=produits-artisanaux&subCategory=fromages",
  },
  {
    title: "Pommes",
    icon: TbApple,
    link: "/search?category=fruits-legumes&subCategory=fruits&product=pomme",
  },
  {
    title: "Fleurs",
    icon: PiFlowerTulipDuotone,
    link: "/search?category=jardin-plants&subCategory=fleurs",
  },
  {
    title: "Oeufs",
    icon: TbEggs,
    link: "/search?category=produits-animaux&subCategory=oeufs",
  },
];

const CategoriesSection = () => {
  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, i) => {
        const Icon = cat.icon;

        return (
          <Link
            key={i}
            href={cat.link}
            className="hover:text-primary flex h-48 flex-col items-center justify-center gap-3 rounded-lg border transition hover:-translate-y-1 hover:shadow-md"
          >
            <Icon className="h-8 w-8" />
            <span className="font-medium">{cat.title}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoriesSection;
