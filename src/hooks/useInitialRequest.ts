// import { EpLlmSchemas as Schemas } from '@/swagger-api';
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import axios, { AxiosResponse, Canceler } from 'axios';

// export type SwaggerApi<P, R> = (params: P, requestConfig?: Schemas.RequestParams) => Promise<AxiosResponse<R, any>>;

// /**
//  * 可以用于 swagger api 初始化请求的 hook (组件销毁自动取消正在发出的请求)
//  */
// export const useSwaggerInitialRequest = <Response, Params>(
//   /** 初始请求参数， null 表示初始时先不发起请求 */
//   initialParams: Params | null,
//   swaggerApi: SwaggerApi<Params, Response>
// ): [Response | null, boolean, (newParams?: Params) => void] => {
//   const [response, setResponse] = useState<Response | null>(null);
//   const [params, setParams] = useState<Params | null>(initialParams);
//   const [loading, setLoading] = useState<boolean>(false);

//   const cancelLast = useRef<Canceler | null>(null);

//   const refresh = useCallback((newParams: Params = {} as unknown as Params) => {
//     setParams(newParams);
//   }, []);

//   const fetchLoaded = () => {
//     setLoading(false);
//     cancelLast.current = null;
//   };

//   useEffect(() => {
//     if (params === null) return;

//     const source = axios.CancelToken.source();
//     cancelLast.current = source.cancel;

//     setLoading(true);
//     swaggerApi(params, { cancelToken: source.token })
//       .then(res => {
//         res.data && setResponse(res.data);
//         fetchLoaded();
//       })
//       .catch(e => {
//         !axios.isCancel(e) && fetchLoaded();
//       })
//       .finally(() => {
//         setLoading(false);
//       });

//     return () => {
//       cancelLast.current?.();
//     };
//   }, [params]);

//   return [response, loading, refresh];
// };

/**
 * 可以用于初始化请求的 hook (组件销毁自动取消正在发出的请求)
 */
export const useInitialRequest = <Response, Params = any>(
  url: string,
  initialParams: Params | null,
  usePost?: boolean
): [Response | null, boolean, (newParams?: Params) => void] => {
  const [response, setResponse] = useState<Response | null>(null);
  const [params, setParams] = useState<Params | null>(initialParams);
  const [loading, setLoading] = useState<boolean>(false);

  const cancelLast = useRef<Canceler | null>(null);

  const refresh = useCallback((newParams: Params = {} as unknown as Params) => {
    setParams(newParams);
  }, []);

  const fetchLoaded = () => {
    setLoading(false);
    cancelLast.current = null;
  };

  useEffect(() => {
    if (params === null) return;

    const source = axios.CancelToken.source();
    cancelLast.current = source.cancel;

    setLoading(true);

    axios({
      method: usePost ? 'POST' : 'GET',
      url,
      data: usePost ? params : undefined,
      params: usePost ? undefined : params,
      cancelToken: source.token,
    })
      .then((res: AxiosResponse<Response>) => {
        res.data && setResponse(res.data);
        fetchLoaded();
      })
      .catch(e => {
        !axios.isCancel(e) && fetchLoaded();
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      cancelLast.current?.();
    };
  }, [params]);

  return [response, loading, refresh];
};
