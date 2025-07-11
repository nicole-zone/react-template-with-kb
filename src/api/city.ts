import { City } from '@/types/city';

const CITIES_STORAGE_KEY = '__cities__';

const getCitiesFromStorage = (): City[] => {
  const citiesStr = localStorage.getItem(CITIES_STORAGE_KEY);
  if (citiesStr) {
    return JSON.parse(citiesStr);
  }
  const defaultCities: City[] = [
    {
      id: '1',
      name: '北京',
      code: 'beijing',
      createTime: Date.now(),
      updateTime: Date.now(),
    },
    {
      id: '2',
      name: '上海',
      code: 'shanghai',
      createTime: Date.now(),
      updateTime: Date.now(),
    },
  ];
  localStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(defaultCities));
  return defaultCities;
};

const saveCitiesToStorage = (cities: City[]) => {
  localStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(cities));
};

export const getCities = (params: {
  current?: number;
  pageSize?: number;
  name?: string;
  code?: string;
}): Promise<{ list: City[]; total: number }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const { current = 1, pageSize = 10, name, code } = params;
      let cities = getCitiesFromStorage();
      if (name) {
        cities = cities.filter(c => c.name.includes(name));
      }
      if (code) {
        cities = cities.filter(c => c.code.includes(code));
      }
      const total = cities.length;
      const start = (current - 1) * pageSize;
      const end = start + pageSize;
      resolve({ list: cities.slice(start, end), total });
    }, 500);
  });
};

export const getCity = (id: string): Promise<City | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const cities = getCitiesFromStorage();
      resolve(cities.find(c => c.id === id));
    }, 300);
  });
};

export const createCity = (data: Omit<City, 'id' | 'createTime' | 'updateTime'>): Promise<City> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let cities = getCitiesFromStorage();
      const newCity: City = {
        ...data,
        id: Date.now().toString(),
        createTime: Date.now(),
        updateTime: Date.now(),
      };
      cities = [newCity, ...cities];
      saveCitiesToStorage(cities);
      resolve(newCity);
    }, 500);
  });
};

export const updateCity = (id: string, data: { name?: string; code?: string }): Promise<City> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cities = getCitiesFromStorage();
      const cityIndex = cities.findIndex(c => c.id === id);
      const originalCity = cities[cityIndex];

      if (cityIndex === -1 || !originalCity) {
        return reject(new Error('City not found'));
      }

      const updatedCity: City = {
        id: originalCity.id,
        name: data.name ?? originalCity.name,
        code: data.code ?? originalCity.code,
        createTime: originalCity.createTime,
        updateTime: Date.now(),
      };
      cities[cityIndex] = updatedCity;
      saveCitiesToStorage(cities);
      resolve(updatedCity);
    }, 500);
  });
};

export const deleteCity = (id: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let cities = getCitiesFromStorage();
      cities = cities.filter(c => c.id !== id);
      saveCitiesToStorage(cities);
      resolve();
    }, 500);
  });
};

export const batchDeleteCities = (ids: string[]): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let cities = getCitiesFromStorage();
      cities = cities.filter(c => !ids.includes(c.id));
      saveCitiesToStorage(cities);
      resolve();
    }, 500);
  });
};
