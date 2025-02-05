import prismaCLT from "../../prismaClient";
import { fa, faker } from "@faker-js/faker";

import colors from "colors";

/**
 * 🌱 Seeding database with fake data
 *
 * Database Structure:
 *
 * - Item: Represents storage items (e.g., ingredients like meat, vegetables).
 * - Plate: Represents meals that customers order (e.g., steak, salad).
 * - Ingredient: Connects Items to Plates (each Plate has multiple Ingredients).
 * - Order: Represents a customer order for a specific Plate.
 * - StockLog: Keeps track of stock changes (restocking, usage, etc.).
 *
 * Relationships:
 * - An `Item` can be used as an `Ingredient` in multiple `Plates`.
 * - A `Plate` consists of multiple `Ingredients`.
 * - An `Order` is linked to a `Plate`.
 * - `StockLog` records stock changes for an `Item`.
 */

async function seed() {
  console.log(colors.cyan("\n🌱 Seeding started..."));

  // 1️⃣ Clear Existing Data
  console.log(colors.yellow("🧹 Clearing existing data..."));
  await prismaCLT.stockLog.deleteMany({});
  await prismaCLT.stockRequestItem.deleteMany({});
  await prismaCLT.stockRequest.deleteMany({});
  await prismaCLT.ingredient.deleteMany({});
  await prismaCLT.order.deleteMany({});
  await prismaCLT.plate.deleteMany({});
  await prismaCLT.item.deleteMany({});
  console.log(colors.green("✅ All existing data cleared."));

  const unitValues = ["KG", "PLATE", "LITRE", "PIECE"] as const;

  // 2️⃣ Generate Fake Items
  console.log(colors.yellow("📦 Generating items..."));
  const items = await Promise.all(
    Array.from({ length: 50 }).map(async () =>
      prismaCLT.item.create({
        data: {
          name: faker.commerce.productName(),
          unit: faker.helpers.arrayElement(unitValues),
          price: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
          stock: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
        },
      })
    )
  );
  console.log(colors.green(`✅ ${items.length} items generated.`));

  // 3️⃣ Generate Fake Plates
  console.log(colors.yellow("🍽️ Generating plates..."));
  const plates = await Promise.all(
    Array.from({ length: 20 }).map(async () =>
      prismaCLT.plate.create({
        data: {
          name: faker.commerce.productName(),
          price: faker.number.float({ min: 5, max: 50, fractionDigits: 2 }),
        },
      })
    )
  );
  console.log(colors.green(`✅ ${plates.length} plates generated.`));

  // 4️⃣ Generate Fake Ingredients
  console.log(colors.yellow("🧑‍🍳 Generating ingredients..."));
  await Promise.all(
    Array.from({ length: 100 }).map(async () =>
      prismaCLT.ingredient.create({
        data: {
          plateId: faker.helpers.arrayElement(plates).id,
          itemId: faker.helpers.arrayElement(items).id,
          quantity: faker.number.float({ min: 0.1, max: 5, fractionDigits: 1 }),
        },
      })
    )
  );
  console.log(colors.green("✅ Ingredients generated."));

  // 5️⃣ Generate Fake Orders
  console.log(colors.yellow("🛒 Generating orders..."));
  await Promise.all(
    Array.from({ length: 50 }).map(async () =>
      prismaCLT.order.create({
        data: {
          plateId: faker.helpers.arrayElement(plates).id,
          quantity: faker.number.int({ min: 1, max: 5 }),
        },
      })
    )
  );
  console.log(colors.green("✅ Orders generated."));

  // 6️⃣ Generate Fake Stock Logs (Mix of Stock Received & Used)
  console.log(colors.yellow("📊 Generating stock logs..."));
  await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      const changeType = faker.helpers.arrayElement(["RECEIVED", "ISSUED"]);
      const quantity =
        changeType === "ISSUED"
          ? -faker.number.float({ min: 1, max: 10, fractionDigits: 1 }) // Negative for issued stock
          : faker.number.float({ min: 1, max: 20, fractionDigits: 1 }); // Positive for received stock

      return prismaCLT.stockLog.create({
        data: {
          itemId: faker.helpers.arrayElement(items).id,
          quantity,
          changeType,
          actionBy: "admin",
        },
      });
    })
  );
  console.log(colors.green("✅ Stock logs generated."));

  // 7️⃣ Generate Fake Stock Requests
  console.log(colors.yellow("📝 Generating stock requests..."));
  const stockRequests = await Promise.all(
    Array.from({ length: 10 }).map(async () =>
      prismaCLT.stockRequest.create({
        data: {
          requester: faker.person.fullName(),
          status: faker.helpers.arrayElement([
            "PENDING",
            "APPROVED",
            "REJECTED",
          ]),
        },
      })
    )
  );
  console.log(
    colors.green(`✅ ${stockRequests.length} stock requests generated.`)
  );

  // 8️⃣ Generate Fake Stock Request Items
  console.log(colors.yellow("📋 Generating stock request items..."));
  await Promise.all(
    stockRequests.map(async (request) => {
      const numItems = faker.number.int({ min: 1, max: 5 });

      return Promise.all(
        Array.from({ length: numItems }).map(async () =>
          prismaCLT.stockRequestItem.create({
            data: {
              requestId: request.id,
              itemId: faker.helpers.arrayElement(items).id,
              requestedQuantity: faker.number.float({
                min: 1,
                max: 5,
                fractionDigits: 1,
              }),
              approvedQuantity: faker.helpers.maybe(() =>
                faker.number.float({ min: 1, max: 5, fractionDigits: 1 })
              ),
              issuedQuantity: faker.helpers.maybe(() =>
                faker.number.float({ min: 1, max: 5, fractionDigits: 1 })
              ),
            },
          })
        )
      );
    })
  );
  console.log(colors.green("✅ Stock request items generated."));

  console.log(colors.cyan("\n✅ Seeding completed successfully!\n"));
}

seed()
  .catch((e) => {
    console.error(colors.red("❌ Error seeding database:"), e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaCLT.$disconnect();
  });
