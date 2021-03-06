import * as React from 'react';
import {
  SelectOptionProps,
  Toolbar,
  ToolbarContent,
  ToolbarToggleGroup,
  ToolbarItem,
  Dropdown,
  DropdownToggle,
  DropdownItem,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';

import { FilterControl } from './FilterControl';

export enum FilterType {
  select = 'select',
  search = 'search',
}

export type FilterValue = string[] | undefined | null;

export interface OptionPropsWithKey extends SelectOptionProps {
  key: string;
}

export interface IBasicFilterCategory<T> {
  key: string;
  title: string;
  type: FilterType; // If we want to support arbitrary filter types, this could be a React node that consumes context instead of an enum
  getItemValue?: (item: T) => string | boolean;
}

export interface ISelectFilterCategory<T> extends IBasicFilterCategory<T> {
  selectOptions: OptionPropsWithKey[];
}

export interface ISearchFilterCategory<T> extends IBasicFilterCategory<T> {
  placeholderText: string;
}

export type FilterCategory<T> = ISearchFilterCategory<T> | ISelectFilterCategory<T>;

export interface IFilterValues {
  [categoryKey: string]: FilterValue;
}

export interface IFilterToolbarProps<T> {
  filterCategories: FilterCategory<T>[];
  filterValues: IFilterValues;
  setFilterValues: (values: IFilterValues) => void;
}

export const FilterToolbar = <T,>({
  filterCategories,
  filterValues,
  setFilterValues,
}: React.PropsWithChildren<IFilterToolbarProps<T>>): JSX.Element | null => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false);
  const [currentCategoryKey, setCurrentCategoryKey] = React.useState(filterCategories[0].key);

  const onCategorySelect = (category) => {
    setCurrentCategoryKey(category.key);
    setIsCategoryDropdownOpen(false);
  };

  const setFilterValue = (category: FilterCategory<T>, newValue: FilterValue) =>
    setFilterValues({ ...filterValues, [category.key]: newValue });

  const currentFilterCategory = filterCategories.find(
    (category) => category.key === currentCategoryKey
  );

  return (
    <Toolbar id="pv-table-filter-toolbar" clearAllFilters={() => setFilterValues({})}>
      <ToolbarContent>
        <ToolbarToggleGroup variant="filter-group" toggleIcon={<FilterIcon />} breakpoint="xl">
          <ToolbarItem>
            <Dropdown
              toggle={
                <DropdownToggle onToggle={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                  <FilterIcon /> {currentFilterCategory?.title}
                </DropdownToggle>
              }
              isOpen={isCategoryDropdownOpen}
              dropdownItems={filterCategories.map((category) => (
                <DropdownItem key={category.key} onClick={() => onCategorySelect(category)}>
                  {category.title}
                </DropdownItem>
              ))}
            />
          </ToolbarItem>
          {filterCategories.map((category) => (
            <FilterControl<T>
              key={category.key}
              category={category}
              filterValue={filterValues[category.key]}
              setFilterValue={(newValue) => setFilterValue(category, newValue)}
              showToolbarItem={currentFilterCategory?.key === category.key}
            />
          ))}
        </ToolbarToggleGroup>
      </ToolbarContent>
    </Toolbar>
  );
};
