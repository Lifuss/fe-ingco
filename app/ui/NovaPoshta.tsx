import React, { useState, useMemo, use } from 'react';
import { GroupBase, OptionsOrGroups } from 'react-select';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { debounce, set } from 'lodash';
import { NovaPoshta } from '@/lib/novaPoshta';
import defaultCitiesJSON from '@/lib/cities.json';

const NovaPoshtaComponent = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const novaPoshta = useMemo(() => new NovaPoshta(), []);
  const defaultCities = useMemo(() => {
    return defaultCitiesJSON.map((city) => ({
      label: city.Description,
      value: {
        fullDescription: city.Description,
        MainDescription: city.Description,
      },
    }));
  }, []);

  const loadOptions = debounce(
    (
      inputValue: string,
      callback: (options: OptionsOrGroups<any, GroupBase<any>>) => void,
    ) => {
      novaPoshta.fetchCities(inputValue).then((data) => {
        if (!data) {
          callback([]);
          return;
        }
        const options = data.Addresses.map((city: any) => ({
          label: city.Present,
          value: {
            fullDescription: city.Present,
            MainDescription: city.MainDescription,
          },
        }));
        callback(options);
      });
    },
    500,
  );

  const handleChange = async (city: any) => {
    setSelectedCity(city);

    setIsLoading(true);
    await novaPoshta
      .fetchWarehouses(city.value.MainDescription, '50')
      .then((data) => {
        setWarehouses(data);
      });
    setIsLoading(false);
  };

  return (
    <div className="flex max-w-[500px] flex-col gap-4 pr-10">
      <label>
        Населений пункт
        <AsyncSelect
          loadOptions={loadOptions}
          defaultOptions={defaultCities}
          onChange={handleChange}
          value={selectedCity}
          getOptionValue={(option) => option.value.fullDescription}
          placeholder="Оберіть місто"
          loadingMessage={() => 'Завантаження...'}
          noOptionsMessage={() => 'Місто не знайдено'}
          required
          name="city"
        />
      </label>
      <label title="Оберіть відділення, якщо не доступно оберіть спочатку місто">
        Відділення
        <Select
          options={warehouses.map((warehouse) => ({
            label: warehouse.Description,
            value: warehouse.Description,
          }))}
          placeholder="Оберіть відділення"
          isLoading={isLoading}
          noOptionsMessage={() => 'Відділення не знайдено'}
          isDisabled={!selectedCity}
          required
          name="warehouse"
        />
      </label>
    </div>
  );
};

export default NovaPoshtaComponent;
