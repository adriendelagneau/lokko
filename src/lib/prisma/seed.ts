import  prisma  from "./prisma";



type CategorySeed = {
  name: string;
  slug: string;
  children: { name: string; slug: string }[];
};

const categories: CategorySeed[] = [
  {
    name: "Fruits & Légumes",
    slug: "fruits-legumes",
    children: [
      { name: "Fruits frais", slug: "fruits-frais" },
      { name: "Légumes frais", slug: "legumes-frais" },
      { name: "Fruits transformés", slug: "fruits-transformes" },
      { name: "Légumes transformés", slug: "legumes-transformes" },
    ],
  },
  {
    name: "Produits animaux",
    slug: "produits-animaux",
    children: [
      { name: "Viande", slug: "viande" },
      { name: "Volaille", slug: "volaille" },
      { name: "Poisson", slug: "poisson" },
      { name: "Œufs", slug: "oeufs" },
      { name: "Produits laitiers", slug: "produits-laitiers" },
    ],
  },
  {
    name: "Boulangerie & Céréales",
    slug: "boulangerie-cereales",
    children: [
      { name: "Pain & viennoiseries", slug: "pain-viennoiseries" },
      { name: "Farines & céréales", slug: "farines-cereales" },
      { name: "Pâtes & riz", slug: "pates-riz" },
    ],
  },
  {
    name: "Produits artisanaux",
    slug: "produits-artisanaux",
    children: [
      { name: "Fromages", slug: "fromages" },
      { name: "Charcuterie", slug: "charcuterie" },
      { name: "Conserves artisanales", slug: "conserves-artisanales" },
      { name: "Plats préparés", slug: "plats-prepares" },
    ],
  },
  {
    name: "Épicerie",
    slug: "epicerie",
    children: [
      { name: "Miel & confitures", slug: "miel-confitures" },
      { name: "Huiles & vinaigres", slug: "huiles-vinaigres" },
      { name: "Épices & condiments", slug: "epices-condiments" },
    ],
  },
  {
    name: "Boissons",
    slug: "boissons",
    children: [
      { name: "Jus & sirops", slug: "jus-sirops" },
      { name: "Vins & bières", slug: "vins-bieres" },
      { name: "Boissons sans alcool", slug: "boissons-sans-alcool" },
    ],
  },
  {
    name: "Jardin & plants",
    slug: "jardin-plants",
    children: [
      { name: "Plants & semis", slug: "plants-semis" },
      { name: "Fleurs", slug: "fleurs" },
      { name: "Terre & compost", slug: "terre-compost" },
    ],
  },
];

async function main() {
  for (const category of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
      },
    });

    for (const child of category.children) {
      await prisma.category.upsert({
        where: { slug: child.slug },
        update: {},
        create: {
          name: child.name,
          slug: child.slug,
          parentId: parent.id,
        },
      });
    }
  }
}

main()
  .then(() => {
    console.log("✅ Categories & subcategories seeded");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
