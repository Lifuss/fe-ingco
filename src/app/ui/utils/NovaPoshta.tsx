import { useState, useMemo } from 'react';
import { GroupBase, OptionsOrGroups } from 'react-select';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { debounce } from 'lodash';
import { NovaPoshta, type NovaPoshtaWarehouse } from '@/lib/novaPoshta';
import defaultCitiesJSON from '@/lib/cities.json';

type CityOption = {
  label: string;
  value: {
    fullDescription: string;
    MainDescription: string;
  };
};

const NovaPoshtaComponent = () => {
  const [warehouses, setWarehouses] = useState<NovaPoshtaWarehouse[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
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
      callback: (options: OptionsOrGroups<CityOption, GroupBase<CityOption>>) => void,
    ) => {
      novaPoshta.fetchCities(inputValue).then((data) => {
        if (!data) {
          callback([]);
          return;
        }
        const options = data.Addresses.map((city) => ({
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

  const handleChange = async (city: CityOption | null) => {
    setSelectedCity(city);

    if (!city) {
      setWarehouses([]);
      return;
    }

    setIsLoading(true);
    await novaPoshta.fetchWarehouses(city.value.MainDescription, '150').then((data) => {
      setWarehouses(data);
    });
    setIsLoading(false);
  };

  return (
    <div className="flex max-w-[500px] flex-col gap-4 pr-10">
      <label>
        Населений пункт <span className="text-red-600">*</span>
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
        Відділення <span className="text-red-600">*</span>
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
