/**
 * Usefull when you have something that can fail and you need to know why
 *
 * Nothing - We asked, but something went wrong. Here's the nothingor.
 *
 * Just - Everything worked, and here's the data.
 */
export type Maybe<A> = Just<A> | Nothing;

/**   Initial just into the realm of Maybe.
 
  /**  Lift an ordinary value into the realm of Maybe.
   **/
export const just = <A>(value: A): Maybe<A> => ({
  _tag: "Just",
  value,
});

/**  Lift an nothingor into the realm of Maybe.
 **/
export const nothing = <A>(): Maybe<A> => ({
  _tag: "Nothing",
});

type Just<A> = { value: A; _tag: "Just" };
type Nothing = { _tag: "Nothing" };

/** Map a function into the Just value.
 * @param whenJust Function to map the succeed value
 * @returns Function thats take the maybe
 * @param maybe The maybe to map
 * @returns The return new states ,if succeed state return mapped state
 * @example map(item => items.filter(predicate)))(loading()) === loading()
 * @example map(item => +item)(just("10")) === just(10)
 */
export const map =
  <A, R>(whenJust: (a: A) => R) =>
  (rd: Maybe<A>) => {
    if (isJust(rd)) return just(whenJust(rd.value));
    return rd;
  };

/** Same as Map but work with async whenJust
 **/
export const mapAsync =
  <A, R>(whenJust: (a: A) => Promise<R>) =>
  async (rd: Maybe<A>): Promise<Maybe<R>> => {
    if (isJust(rd)) {
      const t = await whenJust(rd.value);
      return Promise.resolve(just(t));
    }
    return Promise.resolve(nothing());
  };

/** Combine two maybe sources with the given function. The maybe will succeed when (and if) both sources succeed. If not return de nothing one and if its 2 nothing return the first one.
 * @param whenJust Function to map the succeed value
 * @returns Function thats take the first Maybe
 * @param maybe First Maybe
 * @returns Function thats take the remote second Maybe
 * @param maybe2 Second Maybe
 * @returns The return new states ,if succeed state return mapped state
 * @example map2((item1, item2) => item1 + item2)(loading())(just(10)) === loading()
 * @example map2((item1, item2) => item1 + item2)(just(10))(just(10)) === just(20)
 * @example map2((item1, item2) => item1 + item2)(notAsked())(loading()) === notAsked()
 */
export const map2 =
  <A, B, R>(whenJust: (a: A) => (b: B) => R) =>
  (rd: Maybe<A>) =>
  (rd2: Maybe<B>) => {
    if (isJust(rd) && isJust(rd2)) return just(whenJust(rd.value)(rd2.value));
    if (isNothing(rd)) return rd;
    return rd2;
  };

/** Return the Just value, or the default.
 * @param defaultValue The value returned if is not Just
 * @returns Function thats take the Maybe
 * @param maybe Maybe
 * @returns The default value or the just value
 * @example withDefault("Not Just Maybe")(loading()) === "Not Just Maybe"
 * @example withDefault("Not Just Maybe")(just("10")) === just("10")
 */
export const withDefault =
  <A>(defaultValue: A) =>
  (rd: Maybe<A>) =>
    isJust(rd) ? rd.value : defaultValue;

/** Extract data for each state.
    * @param whenJust Function when is state is Just.
    * @param whenNothing Function when is state is Nothing.
    * @returns Function thats take the maybe
    * @param maybe The maybe to extract
    * @returns The right maybe of the current state
    * @example fold(
                   (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
                   (_ : AxiosNothingor) => <p> Something bad happen! Call the 911 </p> 
             )(notAsked()) === <p> Not Asked yet </p>
    * @example fold(
                   (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
                   (_ : AxiosNothingor) => <p> Something bad happen! Call the 911 </p> 
             )(loading()) === <Loader />,
    * @example fold(
                   (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
                   (_ : AxiosNothingor) => <p> Something bad happen! Call the 911 </p> 
             )(just([items1])) === <> {items.map(\i -> <Item item={i}/>} </>
    * @example fold(
                   (items: List<Item>) => <> {items.map(\i -> <Item item={i}/>} </>,
                   (_ : AxiosNothingor) => <p> Something bad happen! Call the 911 </p> 
             )(nothing(anyNothingor)) === <p> Something bad happen! Call the 911 </p> 
   
    */
export const fold =
  <A, R>(whenJust: (a: A) => R, whenNothing: () => R) =>
  (rd: Maybe<A>) => {
    if (isNothing(rd)) return whenNothing();
    return whenJust(rd.value);
  };

const _isJust = <A>(ma: Maybe<A>): ma is Just<A> => ma._tag === "Just";

export const isJust: <A>(rd: Maybe<A>) => rd is Just<A> = _isJust;

const _isNothing = (ma: Maybe<unknown>): ma is Nothing => ma._tag === "Nothing";

export const isNothing: (rd: Maybe<unknown>) => rd is Nothing = _isNothing;

const Maybe = {
  isNothing,
  isJust,
  fold,
  withDefault,
  map,
  mapAsync,
  map2,
  just,
  nothing,
};

export default Maybe;
