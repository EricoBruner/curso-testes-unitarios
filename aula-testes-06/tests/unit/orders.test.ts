import { faker } from "@faker-js/faker";

import { createOrder, getOrderByProtocol } from "../../src/order-service";
import * as orderRepository from "../../src/order-repository";
import { OrderInput } from "../../src/validator";

describe("Order Service Tests", () => {
  it("should create an order", async () => {
    const order: OrderInput = {
      client: faker.person.fullName(),
      description: faker.lorem.words({ min: 8, max: 15 }),
    };

    jest.spyOn(orderRepository, "create").mockImplementationOnce((): any => {
      return {
        protocol: faker.date.recent().toString(),
        status: "IN_PREPARATION",
      };
    });

    const result = await createOrder(order);

    expect(result).toEqual({
      protocol: expect.any(String),
      status: "IN_PREPARATION",
    });
  });

  it("should return an order based on the protocol", async () => {
    const protocol = faker.date.recent().toString();
    const status = faker.helpers.arrayElement([
      "IN_PREPARATION",
      "READY",
      "CANCELLED",
    ]);

    jest
      .spyOn(orderRepository, "getByProtocol")
      .mockImplementationOnce((): any => {
        return {
          protocol: protocol,
          status: status,
        };
      });

    const result = await getOrderByProtocol(protocol);

    expect(result).toEqual({
      protocol,
      status,
    });
  });

  it("should return status INVALID when protocol doesn't exists", async () => {
    const protocol = faker.date.recent().toString();

    jest.spyOn(orderRepository, "getByProtocol");

    const result = await getOrderByProtocol(protocol);

    expect(result).toEqual({
      protocol: protocol,
      status: "INVALID",
    });
  });
});
