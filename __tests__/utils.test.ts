import { capitalizeFirstLetter } from "../src/utils";

test("capitalizeFirstLetter", () => {
  expect(capitalizeFirstLetter("abc")).toBe("Abc");
  expect(capitalizeFirstLetter("a")).toBe("A");
  expect(capitalizeFirstLetter("$")).toBe("$");
  expect(capitalizeFirstLetter("1")).toBe("1");
  expect(capitalizeFirstLetter(" ")).toBe(" ");
});
