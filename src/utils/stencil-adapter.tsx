import {
  RowData,
  createTable,
  TableOptions,
  TableOptionsResolved,
} from '@tanstack/table-core';

export function flexRender<TProps extends object>(
  Comp: ((props: TProps) => string) | string | undefined,
  props: TProps,
) {
  if (!Comp) {
    return '';
  }

  return typeof Comp == 'function' ? Comp(props) : Comp;
}

export function useStencilTable<TData extends RowData>(
  options: TableOptions<TData>,
) {
  // Throws an error if onStateChange has not been defined inside options.
  if (!options?.onStateChange)
    throw('options.onStateChange has not been defined.');

  // Compose in the generic options to the user options.
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {}, // Dummy state.
    onStateChange: () => {
    }, // noop
    renderFallbackValue: null,
    ...options,
  };

  // Create a new table and store it in state.
  const tableRef = { current: createTable<TData>(resolvedOptions) };

  // By default, manage table state here using the table's initial state.
  const state = tableRef.current.initialState;

  // Compose the default state above with any user state.
  // This will allow the user to only control a subset of the state if desired.
  tableRef.current.setOptions(prev => ({
    ...prev,
    ...options,
    state: {
      ...state,
      ...options.state,
    },
    // Warning: we'll maintain only the user-provided state, which is mandatory!
    onStateChange: updater => {
      options.onStateChange?.(updater);
    },
  }));

  return tableRef.current;
}
