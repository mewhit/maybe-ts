import {
  fold,
  just,
  nothing,
  map,
  map2,
  withDefault,
  mapAsync,
  withDefaultAsync,
} from "./maybe";

describe("RemoteData", () => {
  describe("map", () => {
    const toNumber = (x: string) => +x;
    describe("when Just", () =>
      it("should return Success", () =>
        expect(map(toNumber)(just("10"))).toEqual(just(10))));
    describe("when Nothing", () =>
      it("should return Nothing", () =>
        expect(map(toNumber)(nothing())).toEqual(nothing())));
  });

  describe("mapAsync", () => {
    const toNumber = (x: string) => +x;
    const toNumberAsync = (x: string) => Promise.resolve(+x);
    it("should take non-promise as parameters", async () =>
      expect(await mapAsync(toNumber)(just("10"))).toEqual(just(10)));
    it("should take promise as parameters", async () =>
      expect(
        await mapAsync(toNumberAsync)(Promise.resolve(just("10")))
      ).toEqual(just(10)));
    it("should return Nothing", async () =>
      expect(await mapAsync(toNumber)(nothing())).toEqual(nothing()));
  });
  describe("map2", () => {
    const add = (x: number) => (y: number) => x + y;
    describe("when all are  Just", () =>
      it("should return Success", () =>
        expect(map2(add)(just(10))(just(10))).toEqual(just(20))));
    describe("when one is Nothing", () =>
      it("should return Nothing", () =>
        expect(map2(add)(just(10))(nothing())).toEqual(nothing())));
    describe("when all are not just", () =>
      it("should return the first remotedata", () =>
        expect(map2(add)(nothing())(nothing())).toEqual(nothing())));
  });
  describe("withDefault", () => {
    it("should return Success value when Just", () =>
      expect(withDefault("10")(just("20"))).toEqual("20"));
    it("should return defaultValue when Nothing", () =>
      expect(withDefault("10")(nothing())).toEqual("10"));
  });

  describe("withDefaultAsync", () => {
    it("should take promise as parameters", async () =>
      expect(
        await withDefaultAsync(Promise.resolve("10"))(
          Promise.resolve(just("10"))
        )
      ).toEqual("10"));
    it("should take non-promise as parameters", async () =>
      expect(await withDefaultAsync("10")(just("20"))).toEqual("20"));
    it("should return defaultValue when Nothing", async () =>
      expect(await withDefaultAsync("10")(nothing())).toEqual("10"));
  });
  describe("fold", () => {
    it("should return when Just when isSuccess", () => {
      const expectedValue = "Youpi";
      const remoteData = just("Youpi");
      expect(
        fold(
          (value) => value,
          () => 1
        )(remoteData)
      ).toBe(expectedValue);
    });

    it("should return whenNothing when isNothing", () => {
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
