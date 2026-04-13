import prisma from "@/lib/prisma/prisma";

type CategorySeed = {
  name: string;
  slug: string;
  children: {
    name: string;
    slug: string;
    products: { name: string; slug: string }[];
  }[];
};


const categories: CategorySeed[] = [
  {
    name: "Fruits & Légumes",
    slug: "fruits-legumes",
    children: [
      {
        name: "Fruits frais",
        slug: "fruits-frais",
        products: [
          { name: "Pomme", slug: "pomme" },
          { name: "Poire", slug: "poire" },
          { name: "Banane", slug: "banane" },
          { name: "Orange", slug: "orange" },
        ],
      },
      {
        name: "Légumes frais",
        slug: "legumes-frais",
        products: [
          { name: "Carotte", slug: "carotte" },
          { name: "Tomate", slug: "tomate" },
          { name: "Courgette", slug: "courgette" },
          { name: "Salade", slug: "salade" },
        ],
      },
      {
        name: "Fruits transformés",
        slug: "fruits-transformes",
        products: [
          { name: "Compote", slug: "compote" },
          { name: "Fruits secs", slug: "fruits-secs" },
          { name: "Fruits surgelés", slug: "fruits-surgeles" },
        ],
      },
      {
        name: "Légumes transformés",
        slug: "legumes-transformes",
        products: [
          { name: "Légumes surgelés", slug: "legumes-surgeles" },
          { name: "Purée de légumes", slug: "puree-legumes" },
          { name: "Légumes prêts à cuire", slug: "legumes-prets" },
        ],
      },
    ],
  },
  {
    name: "Produits animaux",
    slug: "produits-animaux",
    children: [
      {
        name: "Viande",
        slug: "viande",
        products: [
          { name: "Bœuf", slug: "boeuf" },
          { name: "Porc", slug: "porc" },
          { name: "Agneau", slug: "agneau" },
        ],
      },
      {
        name: "Volaille",
        slug: "volaille",
        products: [
          { name: "Poulet", slug: "poulet" },
          { name: "Dinde", slug: "dinde" },
        ],
      },
      {
        name: "Poisson",
        slug: "poisson",
        products: [
          { name: "Saumon", slug: "saumon" },
          { name: "Cabillaud", slug: "cabillaud" },
          { name: "Maquereau", slug: "maquereau" },
        ],
      },
      {
        name: "Œufs",
        slug: "oeufs",
        products: [
          { name: "Œufs de poule", slug: "oeufs-poule" },
        ],
      },
      {
        name: "Produits laitiers",
        slug: "produits-laitiers",
        products: [
          { name: "Lait", slug: "lait" },
          { name: "Yaourt", slug: "yaourt" },
          { name: "Fromage frais", slug: "fromage-frais" },
          { name: "Crème fraîche", slug: "creme-fraiche" },
        ],
      },
    ],
  },
  {
    name: "Boulangerie & Céréales",
    slug: "boulangerie-cereales",
    children: [
      {
        name: "Pain & viennoiseries",
        slug: "pain-viennoiseries",
        products: [
          { name: "Baguette", slug: "baguette" },
          { name: "Croissant", slug: "croissant" },
          { name: "Pain complet", slug: "pain-complet" },
        ],
      },
      {
        name: "Farines & céréales",
        slug: "farines-cereales",
        products: [
          { name: "Farine de blé", slug: "farine-ble" },
          { name: "Flocons d'avoine", slug: "flocons-avoine" },
        ],
      },
    ],
  },
  {
    name: "Produits artisanaux",
    slug: "produits-artisanaux",
    children: [
      {
        name: "Fromages",
        slug: "fromages",
        products: [
          { name: "Camembert", slug: "camembert" },
          { name: "Comté", slug: "comte" },
          { name: "Brie", slug: "brie" },
        ],
      },
      {
        name: "Charcuterie",
        slug: "charcuterie",
        products: [
          { name: "Jambon cru", slug: "jambon-cru" },
          { name: "Saucisson", slug: "saucisson" },
        ],
      },
      {
        name: "Plats préparés",
        slug: "plats-prepares",
        products: [
          { name: "Lasagnes", slug: "lasagnes" },
          { name: "Quiches", slug: "quiches" },
        ],
      },
    ],
  },
  {
    name: "Épicerie",
    slug: "epicerie",
    children: [
      {
        name: "Miel & confitures",
        slug: "miel-confitures",
        products: [
          { name: "Miel d'acacia", slug: "miel-acacia" },
          { name: "Confiture fraise", slug: "confiture-fraise" },
        ],
      },
      {
        name: "Huiles & vinaigres",
        slug: "huiles-vinaigres",
        products: [
          { name: "Huile d'olive", slug: "huile-olive" },
          { name: "Vinaigre balsamique", slug: "vinaigre-balsamique" },
        ],
      },
      {
        name: "Épices & condiments",
        slug: "epices-condiments",
        products: [
          { name: "Paprika", slug: "paprika" },
          { name: "Sel de mer", slug: "sel-mer" },
          { name: "Poivre", slug: "poivre" },
        ],
      },
    ],
  },
  {
    name: "Boissons",
    slug: "boissons",
    children: [
      {
        name: "Jus & sirops",
        slug: "jus-sirops",
        products: [
          { name: "Jus d'orange", slug: "jus-orange" },
          { name: "Jus de pomme", slug: "jus-pomme" },
        ],
      },
      {
        name: "Vins & bières",
        slug: "vins-bieres",
        products: [
          { name: "Vin rouge", slug: "vin-rouge" },
          { name: "Vin blanc", slug: "vin-blanc" },
          { name: "Bière blonde", slug: "biere-blonde" },
        ],
      },
      {
        name: "Boissons sans alcool",
        slug: "boissons-sans-alcool",
        products: [
          { name: "Soda", slug: "soda" },
        ],
      },
    ],
  },
  {
    name: "Jardin & plants",
    slug: "jardin-plants",
    children: [
      {
        name: "Plants & semis",
        slug: "plants-semis",
        products: [
          { name: "Tomates à planter", slug: "tomates-plant" },
          { name: "Laitues à planter", slug: "laitues-plant" },
        ],
      },
      {
        name: "Fleurs",
        slug: "fleurs",
        products: [
          { name: "Rose", slug: "rose" },
          { name: "Tulipe", slug: "tulipe" },
        ],
      },
      {
        name: "Terre & compost",
        slug: "terre-compost",
        products: [
          { name: "Terreau", slug: "terreau" },
          { name: "Compost", slug: "compost" },
        ],
      },
    ],
  },
];

/**
 * Seed categories, subcategories and products
 */
async function main() {
  console.log("🌱 Starting seed...");

  let categoriesCreated = 0;
  let subCategoriesCreated = 0;
  let productsCreated = 0;

  for (const category of categories) {
    // Create parent category - use findFirst since slug alone is not unique
    let parent = await prisma.category.findFirst({
      where: { slug: category.slug, parentId: null },
    });

    if (!parent) {
      parent = await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
        },
      });
      categoriesCreated++;
      console.log(`✓ Created category: ${parent.name}`);
    } else {
      console.log(`✓ Found existing category: ${parent.name}`);
    }

    // Create subcategories
    for (const subCategory of category.children) {
      let sub = await prisma.category.findFirst({
        where: { slug: subCategory.slug, parentId: parent.id },
      });

      if (!sub) {
        sub = await prisma.category.create({
          data: {
            name: subCategory.name,
            slug: subCategory.slug,
            parentId: parent.id,
          },
        });
        subCategoriesCreated++;
        console.log(`  ✓ Created subcategory: ${sub.name}`);
      } else {
        console.log(`  ✓ Found existing subcategory: ${sub.name}`);
      }

      // Create products
      for (const product of subCategory.products) {
        const existingProduct = await prisma.product.findFirst({
          where: { slug: product.slug, categoryId: sub.id },
        });

        if (!existingProduct) {
          await prisma.product.create({
            data: {
              name: product.name,
              slug: product.slug,
              categoryId: sub.id,
            },
          });
          productsCreated++;
        }
      }
      console.log(`    ✓ Created ${subCategory.products.length} products for ${sub.name}`);
    }
  }

  console.log(`\n✅ Seed completed!`);
  console.log(`   Categories: ${categoriesCreated}`);
  console.log(`   Subcategories: ${subCategoriesCreated}`);
  console.log(`   Products: ${productsCreated}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
