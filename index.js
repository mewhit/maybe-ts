/**
 * Usefull when you have something that can fail and you need to know why
 *
 * Nothing - We asked, but something went wrong. Here's the nothingor.
 *
 * Just - Everything worked, and here's the data.
 */ /**   Initial just into the realm of Maybe.
 
  /**  Lift an ordinary value into the realm of Maybe.
   **/ const just = (value)=>({
        _tag: 'Just',
        value
    });
/**  Lift an nothingor into the realm of Maybe.
  **/ const nothing = ()=>({
        _tag: 'Nothing'
    });
/** Map a function into the Just value.
  * @param whenJust Function to map the succeed value
  * @returns Function thats take the maybe
  * @param maybe The maybe to map
  * @returns The return new states ,if succeed state return mapped state
  * @example map(item => items.filter(predicate)))(loading()) === loading()
  * @example map(item => +item)(just("10")) === just(10)
  */ const map = (whenJust)=>(rd)=>{
        if (isJust(rd)) return just(whenJust(rd.value));
        return rd;
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
  */ const map2 = (whenJust)=>(rd)=>(rd2)=>{
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
  */ const withDefault = (defaultValue)=>(rd)=>isJust(rd) ? rd.value : defaultValue;
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
   
    */ const fold = (whenJust, whenNothing)=>(rd)=>{
        if (isNothing(rd)) return whenNothing();
        return whenJust(rd.value);
    };
const _isJust = (ma)=>ma._tag === 'Just';
const isJust = _isJust;
const _isNothing = (ma)=>ma._tag === 'Nothing';
const isNothing = _isNothing;

export { fold, isJust, isNothing, just, map, map2, nothing, withDefault };
