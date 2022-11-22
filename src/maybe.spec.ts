import {
  fold,
  just,
  nothing,
  map,
  map2,
  withDefault,
  mapAsync,
  withDefaultAsync,
  foldAsync,
  andThen,
  andThenAsync,
} from "./maybe";

describe("RemoteData", () => {
  describe("andThen", () => {
    const toJustNumber = (x: string) => just(+x);
    const toNothing = (x: string) => nothing();
    it("should return Success when Just", () =>
      expect(andThen(toJustNumber)(just("10"))).toEqual(just(10)));
    it("should return Nothing when Nothing", () =>
      expect(andThen(toNothing)(nothing())).toEqual(nothing()));
  });

  describe("andThenAsync", () => {
    const toJustNumber = (x: string) => just(+x);
    const toJustNumberAsync = (x: string) => Promise.resolve(just(+x));
    const toNothing = (x: string) => nothing();

    it("should take promise as parameters", async () =>
      expect(
        await andThenAsync(toJustNumberAsync)(Promise.resolve(just("10")))
      ).toEqual(just(10)));
    it("should return Success when Just", async () =>
      expect(await andThenAsync(toJustNumber)(just("10"))).toEqual(just(10)));
    it("should return Nothing when Nothing", async () =>
      expect(await andThenAsync(toNothing)(nothing())).toEqual(nothing()));
  });
  describe("map", () => {
    const toNumber = (x: string) => +x;
    it("should return Success when Just", () =>
      expect(map(toNumber)(just("10"))).toEqual(just(10)));
    it("should return Nothing when Nothing", () =>
      expect(map(toNumber)(nothing())).toEqual(nothing()));
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
          () => "none"
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

  describe("foldAsync", () => {
    it("should take async parameters", async () => {
      const expectedValue = "Youpi";
      const remoteData = Promise.resolve(just("Youpi"));
      expect(
        await foldAsync(
          (value: string) => Promise.resolve(value),
          () => Promise.resolve("")
        )(remoteData)
      ).toBe(expectedValue);
    });

    it("should return when Just when isSuccess", async () => {
      const expectedValue = "Youpi";
      const remoteData = just("Youpi");
      expect(
        await foldAsync(
          (value) => value,
          () => 1
        )(remoteData)
      ).toBe(expectedValue);
    });

    it("should return whenNothing when isNothing", async () => {
      const remoteData = nothing();
      expect(
        await foldAsync(
          () => 1,
          () => 0
        )(remoteData)
      ).toBe(0);
    });
  });
});
