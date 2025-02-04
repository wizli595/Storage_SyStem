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
  console.log(colors.cyan("Seeding data..."));

  //Generate Fake Items
  const items = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      return prismaCLT.item.create({
        data: {
          name: faker.commerce.productName(),
          unit: faker.helpers.arrayElement(["KG", "PLATE", "LITRE", "PIECE"]),
          price: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
          stock: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
        },
      });
    })
  );
  console.log(colors.green(`Generated ${items.length} items`));

  //Generate Fake Plates
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
  console.log(colors.green(`Generated ${plates.length} plates`));

  //Generate Fake Ingredients
  await Promise.all(
    Array.from({ length: 100 }).map(() =>
      prismaCLT.ingredient.create({
        data: {
          plateId: faker.helpers.arrayElement(plates).id,
          itemId: faker.helpers.arrayElement(items).id,
          quantity: faker.number.float({
            min: 0.1,
            max: 10,
            fractionDigits: 1,
          }),
        },
      })
    )
  );
  console.log(colors.green("Generated ingredients"));
  //Generate Fake Orders
  await Promise.all(
    Array.from({ length: 50 }).map(() =>
      prismaCLT.order.create({
        data: {
          plateId: faker.helpers.arrayElement(plates).id,
          quantity: faker.number.int({ min: 1, max: 5 }),
        },
      })
    )
  );
  console.log(colors.green("Generated orders"));

  //Generate Fake Stock Logs
  await Promise.all(
    Array.from({ length: 100 }).map(() =>
      prismaCLT.stockLog.create({
        data: {
          itemId: faker.helpers.arrayElement(items).id,
          quantity: faker.number.float({
            min: 0.1,
            max: 10,
            fractionDigits: 1,
          }),
          actionBy: "me",
        },
      })
    )
  );
  console.log(colors.green("Generated stock logs"));
  console.log(colors.cyan("Seeding completed"));
}

seed()
  .catch((e) => {
    console.error(colors.red("❌ Error seeding database:"), e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaCLT.$disconnect();
  });
