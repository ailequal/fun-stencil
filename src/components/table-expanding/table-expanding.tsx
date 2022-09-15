import { Component, Host, h, State, Watch, Prop, Event, EventEmitter } from '@stencil/core';
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Table,
  TableState,
} from '@tanstack/table-core';
import { Person } from '../../utils/make-data';
import { flexRender, useStencilTable } from '../../utils/stencil-adapter';
import { makeData } from '../../utils/make-data';
import Fragment from 'stencil-fragment';
import { JSXBase } from '@stencil/core/internal';
import InputHTMLAttributes = JSXBase.InputHTMLAttributes;

@Component({
  tag: 'table-expanding',
  styleUrl: 'table-expanding.css',
  shadow: true,
})
export class TableExpanding {

  @Prop() checkbox: boolean = true;

  @State() table: Table<Person>;

  @State() state: TableState | null = null;

  @State() data: Person[] = makeData(100, 5, 3);

  @State() columns: ColumnDef<Person>[] = [
    {
      header: 'Name',
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: 'firstName',
          header: ({ table }) => (
            <Fragment>
              {this.checkbox ?
                <this.IndeterminateCheckbox
                  {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                  }}
                /> : ''
              }
              {' '}
              <button
                {...{
                  onClick: table.getToggleAllRowsExpandedHandler(),
                }}
              >
                {table.getIsAllRowsExpanded() ? '👇' : '👉'}
              </button>
              {' '}
              First Name
            </Fragment>
          ),
          cell: ({ row, getValue }) => (
            <div
              style={{
                // Since rows are flattened by default, we can use the row.depth property
                // and paddingLeft to visually indicate the depth of the row.
                paddingLeft: `${row.depth * 2}rem`,
              }}
            >
              <Fragment>
                {this.checkbox ?
                  <this.IndeterminateCheckbox
                    {...{
                      checked: row.getIsSelected(),
                      indeterminate: row.getIsSomeSelected(),
                      onChange: row.getToggleSelectedHandler(),
                    }}
                  /> : ''
                }
                {' '}
                {row.getCanExpand() ? (
                  <button
                    {...{
                      onClick: row.getToggleExpandedHandler(),
                      style: { cursor: 'pointer' },
                    }}
                  >
                    {row.getIsExpanded() ? '👇' : '👉'}
                  </button>
                ) : (
                  '🔵'
                )}{' '}
                {getValue()}
              </Fragment>
            </div>
          ),
          footer: props => props.column.id,
        },
        {
          accessorFn: row => row.lastName,
          id: 'lastName',
          cell: info => info.getValue(),
          header: () => <span>Last Name</span>,
          footer: props => props.column.id,
        },
      ],
    },
    {
      header: 'Info',
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: 'age',
          header: () => 'Age',
          footer: props => props.column.id,
        },
        {
          header: 'More Info',
          columns: [
            {
              accessorKey: 'visits',
              header: () => <span>Visits</span>,
              footer: props => props.column.id,
            },
            {
              accessorKey: 'status',
              header: 'Status',
              footer: props => props.column.id,
            },
            {
              accessorKey: 'progress',
              header: 'Profile Progress',
              footer: props => props.column.id,
            },
          ],
        },
      ],
    },
  ];

  @State() rerender: boolean = false;

  @Event() handleSubmitData: EventEmitter<string>;

  @Watch('state')
  watchStateHandler(newValue: TableState) {
    this.table = useStencilTable<Person>({
      state: newValue,
      data: this.data,
      columns: this.columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      getSubRows: row => row.subRows,
      onStateChange: (updater) => {
        this.state = (typeof updater === 'function') ? updater(this.table.getState()) : updater;
      },
      // debugAll: true,
    });
  }

  componentWillLoad() {
    this.watchStateHandler(this.state);
  }

  updateTable(newState: TableState = this.state) {
    this.state = { ...newState };
  }

  submitData() {
    // Some examples for retrieving the user selection.
    if (!this.table.getIsSomeRowsSelected() && !this.table.getIsAllRowsSelected()) {
      console.log('Nothing to submit.');
      return;
    }

    const rowSelection = this.table.getState().rowSelection;

    Object.entries(rowSelection)
      .filter(row => !!row[1])
      .map(row => {
        const firstName = this.table.getRow(row[0]).getValue('firstName') as string;
        // this.handleSubmitData.emit(firstName);
        console.log('firstName', firstName);
      });
  }

  refreshData() {
    this.data = makeData(100, 5, 3);
    this.table.resetRowSelection();
    this.table.resetExpanded();
    this.table.resetPageIndex();
    this.updateTable();
  }

  Filter({ column, table }: { column: Column<any, any>, table: Table<any> }) {
    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    return typeof firstValue === 'number' ? (
      <div>
        <input
          type='number'
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={e => {
            table.resetPageIndex();
            const target = e.target as EventTarget & HTMLInputElement;
            return column.setFilterValue((old: [number, number]) => [
              target.value,
              old?.[1],
            ]);
          }
          }
          placeholder={`Min`}
        />
        <input
          type='number'
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={e => {
            table.resetPageIndex();
            const target = e.target as EventTarget & HTMLInputElement;
            return column.setFilterValue((old: [number, number]) => [
              old?.[0],
              target.value,
            ]);
          }
          }
          placeholder={`Max`}
        />
      </div>
    ) : (
      <input
        type='text'
        value={(columnFilterValue ?? '') as string}
        onChange={e => {
          this.table.resetPageIndex();
          const target = e.target as EventTarget & HTMLInputElement;
          return column.setFilterValue(target.value);
        }
        }
        placeholder={`Search...`}
      />
    );
  }

  IndeterminateCheckbox({
                          indeterminate,
                          ...rest
                        }: { indeterminate?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
    // TODO: In stencil there is not an easy way to retrieve and store each checkbox ref easily.
    //  It can be done for a single element, but if there are so many...
    //  useRef => access dom elements || create mutable variable without re-rendering the component
    //  useEffect => do some async operation when X happens/changes

    // Get the ref of the new checkbox that will be returned.
    // const ref = React.useRef<HTMLInputElement>(null!); // An empty parameter would just be fine.

    // When the ref or indeterminate changes set the indeterminate inner value of ref.
    // React.useEffect(() => {
    //   if (typeof indeterminate === 'boolean') {
    //     ref.current.indeterminate = !rest.checked && indeterminate;
    //   }
    // }, [ref, indeterminate]);

    return (
      <input
        type='checkbox'
        onClick={(e) => {
          console.log('Checkbox', e);
        }}
        // ref={ref}
        {...rest}
      />
    );
  }

  render() {
    return (
      <Host>
        <h2>table-expanding</h2>

        <table>
          <thead>
          {this.table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <this.Filter column={header.column} table={this.table} />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
          </thead>
          <tbody>
          {this.table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          </tbody>
        </table>
        <br /><br /><br />
        <div>
          <button
            onClick={() => this.table.setPageIndex(0)}
            disabled={!this.table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            onClick={() => this.table.previousPage()}
            disabled={!this.table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            onClick={() => this.table.nextPage()}
            disabled={!this.table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            onClick={() => this.table.setPageIndex(this.table.getPageCount() - 1)}
            disabled={!this.table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span>
          <div>Page</div>
          <strong>
            {this.table.getState().pagination.pageIndex + 1} of{' '}
            {this.table.getPageCount()}
          </strong>
        </span>
          <span>
          | Go to page:
          <input
            type='number'
            defaultValue={(this.table.getState().pagination.pageIndex + 1).toString()}
            onChange={e => {
              const target = e.target as EventTarget & HTMLInputElement;
              const page = target.value ? Number(target.value) - 1 : 0;
              this.table.setPageIndex(page);
            }}
          />
        </span>
          <select
            onChange={e => {
              const target = e.target as EventTarget & HTMLInputElement;
              this.table.setPageSize(Number(target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize} selected={pageSize === this.table.getState().pagination.pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div>{this.table.getRowModel().rows.length} Rows</div>
        <div>
          <button onClick={() => this.submitData()}>Submit Data</button>
        </div>
        <div>
          <button onClick={() => this.refreshData()}>Refresh Data</button>
        </div>
        <div>
          <button onClick={() => this.rerender = !this.rerender}>Rerender</button>
        </div>
        <pre>
          {JSON.stringify(
            {
              rerender: this.rerender,
              table: this.table,
            },
            null,
            2,
          )}
        </pre>
      </Host>
    );
  }

}
