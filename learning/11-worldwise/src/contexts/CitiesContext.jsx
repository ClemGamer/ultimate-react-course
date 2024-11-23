import { createContext, useCallback, useEffect, useReducer } from "react";

const URL = "http://localhost:3001";

const CitiesContext = createContext();

const initialState = {
  isLoading: false,
  cities: [],
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true, error: "" };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload, error: "" };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
        error: "",
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
        error: "",
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        error: "",
      };
    case "rejected":
      if (action.payload.error.name === "AbortError")
        return { ...state, isLoading: false };

      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknow action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    let controller = new AbortController();
    async function getCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${URL}/cities`, { signal: controller.signal });
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (e) {
        dispatch({
          type: "rejected",
          payload: { message: "fetch cities error", error: e },
        });
      }
    }
    getCities();
    return () => controller.abort();
  }, []);

  const getCity = useCallback(
    async function getCity(id, signal) {
      if (id === currentCity.id) return;

      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${URL}/cities/${id}`, { signal });
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (e) {
        dispatch({
          type: "rejected",
          payload: { message: "fetch city error", error: e },
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      dispatch({ type: "city/created", payload: data });
    } catch (e) {
      dispatch({
        type: "rejected",
        payload: { message: "create city error", error: e },
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (e) {
      dispatch({
        type: "rejected",
        payload: { message: "delete city error", error: e },
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
