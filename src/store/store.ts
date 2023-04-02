import {configureStore, Dispatch, MiddlewareAPI} from '@reduxjs/toolkit';
import calcReducer, {load_articles} from './CalcSlice';

export const myLoggingMiddleware =  ({ dispatch, getState }: MiddlewareAPI) =>  (next: Dispatch) => (action: any) => {
    // Here you have access to `action.type` and `action.payload`
    console.log('Logging action with type', action.type);
    // Get an apiKey here: https://newsapi.org/register and replace XXXXXX
    const url: string = 'https://newsapi.org/v2/everything?q=tech&apiKey=XXXXXX';

    if (action.type !== 'calc/load_articles')
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
            dispatch(load_articles( json.articles.map(({title,description, urlToImage}: any) => ({title,description, img: urlToImage}) )));
            return next(action);
        })
        .catch((error) => {
            console.error(error);
            dispatch(load_articles( [{title: error.message, description: `${url}: ${error.stack}`}] ));
            return next(action);
            }
        )
    else
        return next(action);
}

export const store = configureStore({
    reducer: {
        calc: calcReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(myLoggingMiddleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;