import Link from "next/link";
import restaurants from "../../data/index.json";
import RankingList from "@/components/RankingList";
import GuidedStickyNav from "@/components/GuidedStickyNav";
import RestaurantHeader from "@/components/RestaurantHeader";
import type { MenuItem } from "@/types/menu";

// calories per 1g protein (bigger number = more calories for each gram of protein)
function caloriesPerProtein(item: MenuItem) {
  if (!item.nutrition.protein) return Number.POSITIVE_INFINITY;
  return item.nutrition.calories / item.nutrition.protein;
}

function topByProtein(items: MenuItem[]) {
  return [...items].sort((a, b) => b.nutrition.protein - a.nutrition.protein);
}

function topByCalorieProteinRatio(items: MenuItem[]) {
  return [...items].sort((a, b) => caloriesPerProtein(a) - caloriesPerProtein(b));
}

function lowestCalories(items: MenuItem[]) {
  return [...items].sort((a, b) => a.nutrition.calories - b.nutrition.calories);
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <main style={{ maxWidth: 900, margin: "48px auto", padding: 16 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          ← Back
        </Link>
        <h1 style={{ marginTop: 16 }}>Restaurant not found</h1>
      </main>
    );
  }

  const menu = await import(`../../data/${restaurant.menuFile}`);
  const items = menu.default.items;

  const highestProtein = topByProtein(items);
  const bestCalorieProteinRatio = topByCalorieProteinRatio(items);
  const lowestCalorieItems = lowestCalories(items);
  const brandColorById: Record<string, string> = {
    chickfila: "#E31937",
    chipotle: "#9A1B1F",
    panera: "#5A3C2D",
    mcdonalds: "#F4B400",
    starbucks: "#006241",
    habit: "#F0542D",
    panda: "#D32F2F",
    mod: "#2F2D2E",
    subway: "#0E9E4A",
  };

  return (
    // ✅ Full width wrapper (this is the single parent React needs)
    <div style={{ width: "100%" }}>
      {/* ✅ Full-width sticky nav */}
      <GuidedStickyNav
        restaurantName={restaurant.name}
        restaurantLogo={restaurant.logo}
        containerMaxWidth={900}
      />

      {/* ✅ Centered page content container */}
      <RestaurantHeader
        name={restaurant.name}
        logo={restaurant.logo}
        brandColor={brandColorById[restaurant.id] ?? "#3B82F6"}
      />

      <main style={{ maxWidth: 900, margin: "24px auto 48px", padding: 16 }}>

        {/* Highest Protein */}
        <section id="high-protein" style={{ marginTop: 80, scrollMarginTop: 140 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>
            Highest Protein Items
          </h2>

          <p style={{ marginTop: 8, opacity: 0.8, marginBottom: 20 }}>
            Items with the most protein per serving size.
          </p>

          <RankingList items={highestProtein} highlightTop={3} />
        </section>

        {/* Best Protein Ratio */}
        <section
          id="best-protein-ratio"
          style={{ marginTop: 80, scrollMarginTop: 140 }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Best Protein Ratio</h2>

          <p style={{ marginTop: 6, opacity: 0.75 }}>
            Ranked by protein efficiency (more protein per calorie).
          </p>

          <RankingList items={bestCalorieProteinRatio} highlightTop={3} showRatio />
        </section>

        {/* Lowest Calories */}
        <section
          id="lowest-calorie"
          style={{ marginTop: 80, scrollMarginTop: 140 }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>Lowest Calorie Items</h2>

          <p style={{ marginTop: 6, opacity: 0.75 }}>
            Lowest calorie foods on the menu.
          </p>

          <RankingList items={lowestCalorieItems} highlightTop={3} />
        </section>
      </main>
    </div>
  );
}
