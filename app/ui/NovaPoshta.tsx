import { NovaPoshta } from '@/lib/novaPoshta';
import React, { useState, useEffect, useMemo } from 'react';
import { GroupBase, OptionsOrGroups } from 'react-select';
import AsyncSelect from 'react-select/async';

const NovaPoshtaComponent: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [cityRef, setCityRef] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const novaPoshta = useMemo(() => new NovaPoshta(), []);

  const loadOptions = (
    inputValue: string,
    callback: (options: OptionsOrGroups<any, GroupBase<any>>) => void,
  ) => {
    novaPoshta.fetchCities(inputValue).then((data) => {
      const options = data.Addresses.map((city: any) => ({
        label: city.Present,
        value: city.Ref,
      }));
      callback(options);
    });
  };

  const handleChange = (city: any) => {
    setSelectedCity(city);
    setCityRef(city.Ref);
  };

  useEffect(() => {
    if (!cityRef) {
      return;
    }
    novaPoshta.fetchWarehouses(cityRef).then((data) => {
      setWarehouses(data.data);
    });
  }, [cityRef, novaPoshta]);

  return (
    <div className="w-1/2">
      <AsyncSelect
        loadOptions={loadOptions}
        defaultValue
        onChange={handleChange}
        value={selectedCity}
        placeholder="Оберіть місто"
      />
      <ul>
        {warehouses.map((warehouse) => (
          <li key={warehouse.Ref}>{warehouse.Description}</li>
        ))}
      </ul>
    </div>
  );
};

export default NovaPoshtaComponent;
