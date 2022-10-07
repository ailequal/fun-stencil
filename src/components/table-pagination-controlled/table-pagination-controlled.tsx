import { Component, Host, h, State, Watch } from '@stencil/core';
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  Table,
  TableState,
} from '@tanstack/table-core';
import { fetchData, Person } from '../../utils/make-data';
import { flexRender, useStencilTable } from '../../utils/stencil-adapter';

@Component({
  tag: 'table-pagination-controlled',
  styleUrl: 'table-pagination-controlled.css',
  shadow: true,
})
export class TablePaginationControlled {

  @State() table: Table<Person>;

  @State() tableState: TableState | {} = {};

  @Watch('tableState')
  watchTableStateHandler(newTableState: TableState, oldTableState: TableState) {
    console.log('watchTableStateHandler');
    this.createTable();
  }

  @State() paginationState: PaginationState = {
    pageIndex: 0,
    pageSize: 10,
  };

  @State() data: Person[] = [];

  @State() columns: ColumnDef<Person>[] = [
    {
      header: 'Name',
      footer: props => props.column.id,
      columns: [
        {
          accessorKey: 'firstName',
          cell: info => info.getValue(),
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

  @State() pageCount: number = 1;

  @State() isFetching: boolean = true;

  @State() rerender: boolean = false;

  /**
   * Render the table for the first time.
   * The rendering will only happen when the promise will be resolved.
   */
  componentWillLoad() {
    console.log('componentWillLoad');
    return fetchData(this.paginationState)
      .then(value => {
          this.data = value.rows;
          this.pageCount = value.pageCount;
          this.createTable();
        },
      ).catch(error => {
        console.log(error);
      });
  }

  /**
   * Create a new table instance based on the component properties.
   */
  createTable() {
    console.log('createTable');
    this.table = useStencilTable<Person>({
      state: { ...this.tableState, pagination: this.paginationState },
      data: this.data,
      columns: this.columns,
      pageCount: this.pageCount,
      getCoreRowModel: getCoreRowModel(),
      onStateChange: (updater) => {
        console.log('onStateChange');
        this.tableState = (typeof updater === 'function') ? updater(this.table.getState()) : updater;
      },
      onPaginationChange: (updater) => {
        console.log('onPaginationChange');
        this.isFetching = true;
        this.paginationState = (typeof updater === 'function') ? updater(this.paginationState) : updater;
        fetchData({
          pageIndex: this.paginationState.pageIndex,
          pageSize: this.paginationState.pageSize,
        })
          .then(value => {
            this.data = value.rows;
            this.pageCount = value.pageCount;
            this.refreshTable();
          })
          .catch(error => {
            console.log(error);
          });
      },
      manualPagination: true,
      // debugAll: true,
    });
    this.isFetching = false;
  }

  /**
   * Refresh the table rendering from scratch by passing the same state as a new variable reference
   * (this is possible through the Watch() decorator on "tableState").
   */
  refreshTable() {
    this.tableState = { ...this.tableState };
  }

  /**
   * The table rendering function.
   */
  render() {
    if (!Object.keys(this.table).length) return <h2>table-error</h2>;
    // if(this.isFetching) return <h2>loading</h2>

    return (
      <Host>
        <h2>table-pagination-controlled</h2>
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
          {this.isFetching ? 'Loading...' : null}
        </div>
        <div>{this.table.getRowModel().rows.length} Rows</div>
        <div>
          <button onClick={() => this.rerender = !this.rerender}>Rerender</button>
        </div>
        <pre>
          {JSON.stringify(
            {
              isFetching: this.isFetching,
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
