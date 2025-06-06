import prismaCLT from "../../prismaClient";
import { faker } from "@faker-js/faker";
import colors from "colors";

async function seed() {
  console.log(colors.cyan("\n🌱 Seeding started..."));

  // 1 Clear Existing Data
  console.log(colors.yellow(" Clearing existing data..."));
  await prismaCLT.stockLog.deleteMany({});
  await prismaCLT.stockRequestItem.deleteMany({});
  await prismaCLT.stockRequest.deleteMany({});
  await prismaCLT.ingredient.deleteMany({});
  await prismaCLT.order.deleteMany({});
  await prismaCLT.plate.deleteMany({});
  await prismaCLT.item.deleteMany({});
  console.log(colors.green("All existing data cleared."));

  const unitValues = ["KG", "PLATE", "LITRE", "PIECE"] as const;

  // 2️ Generate Fake Items
  console.log(colors.yellow(" Generating items..."));
  const items = await Promise.all(
    Array.from({ length: 50 }).map(async () =>
      prismaCLT.item.create({
        data: {
          name: faker.commerce.productName(),
          unit: faker.helpers.arrayElement(unitValues),
          price: faker.number.float({ min: 5, max: 200, fractionDigits: 2 }),
          stock: faker.number.float({ min: 20, max: 500, fractionDigits: 1 }),
          minStock: faker.number.float({
            min: 10,
            max: 100,
            fractionDigits: 1,
          }),
          createdAt: faker.date.past({ years: 1 }),
        },
      })
    )
  );
  console.log(colors.green(` ${items.length} items generated.`));

  // 3️ Generate Fake Plates
  console.log(colors.yellow(" Generating plates..."));
  const plates = await Promise.all(
    Array.from({ length: 20 }).map(async () =>
      prismaCLT.plate.create({
        data: {
          name: faker.commerce.productName(),
          price: faker.number.float({ min: 20, max: 100, fractionDigits: 2 }),
          createdAt: faker.date.past({ years: 1 }),
        },
      })
    )
  );
  console.log(colors.green(` ${plates.length} plates generated.`));

  // 4️ Generate Fake Ingredients
  console.log(colors.yellow(" Generating ingredients..."));
  await Promise.all(
    Array.from({ length: 100 }).map(async () =>
      prismaCLT.ingredient.create({
        data: {
          plateId: faker.helpers.arrayElement(plates).id,
          itemId: faker.helpers.arrayElement(items).id,
          quantity: faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 }),
          createdAt: faker.date.past({ years: 1 }),
        },
      })
    )
  );
  console.log(colors.green(" Ingredients generated."));

  // 5️ Generate Fake Orders
  console.log(colors.yellow(" Generating orders..."));
  const orders = await Promise.all(
    Array.from({ length: 100 }).map(async () =>
      prismaCLT.order.create({
        data: {
          plateId: faker.helpers.arrayElement(plates).id,
          quantity: faker.number.int({ min: 1, max: 10 }),
          createdAt: faker.date.recent({ days: 30 }), // last 30 days random
        },
      })
    )
  );
  console.log(colors.green(`${orders.length} Orders generated.`));

  // 6️ Legit Stock Requests (80% of Orders)
  console.log(colors.yellow(" Generating legit stock requests..."));
  const legitOrders = faker.helpers.arrayElements(orders, 80); // 80% legit

  await Promise.all(
    legitOrders.map(async (order) => {
      const stockRequest = await prismaCLT.stockRequest.create({
        data: {
          requester: faker.person.fullName(),
          status: faker.helpers.arrayElement([
            "PENDING",
            "APPROVED",
            "REJECTED",
            "COMPLETED",
          ]),
          createdAt: order.createdAt,
        },
      });

      const ingredients = await prismaCLT.ingredient.findMany({
        where: { plateId: order.plateId },
      });

      await Promise.all(
        ingredients.map((ingredient) =>
          prismaCLT.stockRequestItem.create({
            data: {
              requestId: stockRequest.id,
              itemId: ingredient.itemId,
              requestedQuantity: ingredient.quantity * order.quantity,
              approvedQuantity: faker.helpers.maybe(() =>
                faker.number.float({ min: 1, max: 20, fractionDigits: 1 })
              ),
              issuedQuantity: faker.helpers.maybe(() =>
                faker.number.float({ min: 1, max: 20, fractionDigits: 1 })
              ),
              createdAt: order.createdAt,
            },
          })
        )
      );
    })
  );
  console.log(colors.green(" Legit stock requests generated."));

  // 7️ Generate Fake Stock Requests (simulate stealing, 20%)
  console.log(colors.yellow(" Generating fake stock requests (stealing)..."));
  const fakeRequestsCount = 20;
  await Promise.all(
    Array.from({ length: fakeRequestsCount }).map(async () => {
      const stockRequest = await prismaCLT.stockRequest.create({
        data: {
          requester: faker.person.fullName(),
          status: "PENDING", // likely suspicious
          createdAt: faker.date.recent({ days: 30 }),
        },
      });

      const randomItems = faker.helpers.arrayElements(
        items,
        faker.number.int({ min: 1, max: 5 })
      );

      await Promise.all(
        randomItems.map((item) =>
          prismaCLT.stockRequestItem.create({
            data: {
              requestId: stockRequest.id,
              itemId: item.id,
              requestedQuantity: faker.number.float({
                min: 30,
                max: 100,
                fractionDigits: 1,
              }), // exaggerated quantities
              approvedQuantity: null,
              issuedQuantity: null,
              createdAt: faker.date.recent({ days: 30 }),
            },
          })
        )
      );
    })
  );
  console.log(colors.green(" Fake stock requests generated."));

  // 8️ Generate Stock Logs
  console.log(colors.yellow(" Generating stock logs..."));
  await Promise.all(
    Array.from({ length: 200 }).map(async () => {
      const changeType = faker.helpers.arrayElement([
        "RECEIVED",
        "ISSUED",
        "ADJUSTMENT",
      ]);
      const quantity =
        changeType === "ISSUED"
          ? -faker.number.float({ min: 1, max: 20, fractionDigits: 1 })
          : faker.number.float({ min: 1, max: 50, fractionDigits: 1 });

      return prismaCLT.stockLog.create({
        data: {
          itemId: faker.helpers.arrayElement(items).id,
          quantity,
          changeType,
          actionBy: faker.person.firstName(),
          date: faker.date.recent({ days: 90 }),
        },
      });
    })
  );
  console.log(colors.green(" Stock logs generated."));

  console.log(colors.cyan("🎉 Seeding completed successfully!\n"));
}

seed()
  .catch((e) => {
    console.error(colors.red(" Error seeding database:"), e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaCLT.$disconnect();
  });
