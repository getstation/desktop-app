export const combineAll = (reducers: any[]) => {
  return (state: any, action: any) => {
    let newState = state;
    for (const reducer of reducers) {
      newState = reducer(newState, action);
    }
    return newState;
  };
};

export const dummy = null;
