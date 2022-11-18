import {  fold, just,  nothing, map, map2, withDefault } from "./maybe";

describe("RemoteData", () => {
  describe("map", () => {
    const toNumber = (x: string) => +x;
    describe("when Just", () => it("should return Success", () => expect(map(toNumber)(just("10"))).toEqual(just(10))));
    describe("when Nothing", () => it("should return Nothing", () => expect(map(toNumber)(nothing())).toEqual(nothing())));
  });
  describe("map2", () => {
    const add = (x: number) => (y: number) => x + y;
    describe("when all are  Just", () => it("should return Success", () => expect(map2(add)(just(10))(just(10))).toEqual(just(20))));
    describe("when one is Nothing", () => it("should return Nothing", () => expect(map2(add)(just(10))(nothing())).toEqual(nothing())));
    describe("when all are not just", () =>
      it("should return the first remotedata", () => expect(map2(add)(nothing())(nothing())).toEqual(nothing())));
  });
  describe("withDefault", () => {
    describe("when Just", () => it("should return Success value", () => expect(withDefault("10")(just("20"))).toEqual("20")));
    describe("when Nothing", () => it("should return defaultValue", () => expect(withDefault("10")(nothing())).toEqual("10")));
  });
  describe("fold", () => {
    describe("when isSuccess", () => {
      it("should return when Just", () => {
        const expectedValue = "Youpi";
        const remoteData = just("Youpi");
        expect(
          fold(
            (value) => value,
            () => 1
          )(remoteData)
        ).toBe(expectedValue);
      });
    });

    describe("when isNothing", () => {
      it("should return whenNothing", () => {
        const remoteData = nothing();
        expect(
          fold(
            () => 1,
            () => 0
          )(remoteData)
        ).toBe(0);
      });
    });
  });
});