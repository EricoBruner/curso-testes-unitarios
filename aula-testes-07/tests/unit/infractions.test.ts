import { getInfractionsFrom } from "infractions-service";
import { getLevel } from "../integration/factories/user-infractions-factory";
import * as infractionsRepository from "../../src/infractions-repository";
import * as usersRepository from "../../src/users-repository";
import { faker } from "@faker-js/faker";

describe("Infractions Service Tests", () => {
  it("should get infractions from user", async () => {
    const id = faker.number.int();

    const objectUser = {
      id,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      licenseId: faker.internet.ipv4().replace("/./g", ""),
    };

    const arrayInfractions = [
      {
        userId: id,
        date: new Date(),
        cost: faker.number.int({ min: 100, max: 1000 }),
        level: getLevel(),
        description: faker.company.catchPhrase(),
      },
    ];

    jest
      .spyOn(usersRepository, "getUserByDocument")
      .mockImplementationOnce((): any => {
        return objectUser;
      });

    jest
      .spyOn(infractionsRepository, "getInfractionsFrom")
      .mockImplementationOnce((): any => {
        return arrayInfractions;
      });

    const order = await getInfractionsFrom(objectUser.licenseId);

    expect(order).toMatchObject({
      id: objectUser.id,
      firstName: objectUser.firstName,
      lastName: objectUser.lastName,
      licenseId: objectUser.licenseId,
    });

    const { infractions } = order;

    expect(infractions).toEqual(arrayInfractions);
  });

  it("should throw an error when driver license does not exists", () => {
    const licenseId = "license";

    jest
      .spyOn(usersRepository, "getUserByDocument")
      .mockImplementationOnce((): any => {
        return undefined;
      });

    const result = getInfractionsFrom(licenseId);

    expect(result).rejects.toEqual({
      type: "NOT_FOUND",
      message: "Driver not found.",
    });
  });
});
