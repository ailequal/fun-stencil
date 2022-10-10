import { Component, Host, h, State, Watch, Prop } from '@stencil/core';
import {
  ColumnDef,
  ColumnResizeMode,
  getCoreRowModel,
  Table,
  TableState,
} from '@tanstack/table-core';
import { flexRender, useStencilTable } from '../../utils/stencil-adapter';

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

@Component({
  tag: 'table-column-sizing',
  styleUrl: 'table-column-sizing.css',
  shadow: true,
})
export class TableColumnSizing {

  @State() table: Table<Person>;

  @State() tableState: TableState | {} = {};

  @Watch('tableState')
  watchTableStateHandler(newTableState: TableState, oldTableState: TableState) {
    this.createTable();
  }

  @State() data: Person[] = [
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 24,
      visits: 100,
      status: 'In Relationship',
      progress: 50,
    },
    {
      firstName: 'tandy',
      lastName: 'miller',
      age: 40,
      visits: 40,
      status: 'Single',
      progress: 80,
    },
    {
      firstName: 'joe',
      lastName: 'dirte',
      age: 45,
      visits: 20,
      status: 'Complicated',
      progress: 10,
    },
  ];

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

  @Prop() column_resize_mode: ColumnResizeMode = 'onChange';

  /**
   * Render the table for the first time.
   */
  componentWillLoad() {
    this.createTable();
  }

  /**
   * Create a new table instance based on the component properties.
   */
  createTable() {
    this.table = useStencilTable<Person>({
      state: { ...this.tableState },
      data: this.data,
      columns: this.columns,
      columnResizeMode: this.column_resize_mode,
      getCoreRowModel: getCoreRowModel(),
      onStateChange: (updater) => {
        this.tableState = (typeof updater === 'function') ? updater(this.table.getState()) : updater;
      },
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    });
  }

  /**
   * Refresh the table rendering from scratch by passing the same state as a new variable reference
   * (this is possible through the Watch() decorator on "tableState").
   */
  refreshTable() {
    this.tableState = { ...this.tableState };
  }

  /**
   * Toggle the table column resizing mode between "onEnd" and "onChange".
   */
  toggleResizeMode() {
    this.column_resize_mode = ('onChange' === this.column_resize_mode) ? 'onEnd' : 'onChange';
    this.refreshTable();
  }

  /**
   * The table rendering function.
   */
  render() {
    if (!Object.keys(this.table).length) return <h2>table-error</h2>;

    return (
      <Host>
        <h2>table-column-sizing</h2>

        <table {...{ style: { width: this.table.getCenterTotalSize().toString() + 'px' } }}>
          <thead>
          {this.table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  {...{
                    key: header.id,
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize().toString() + 'px',
                    },
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  <div
                    {...{
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`,
                    }}
                  />
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody>
          {this.table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  {...{
                    key: cell.id,
                    style: {
                      width: cell.column.getSize().toString() + 'px',
                    },
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
        <br /><br /><br />
        <button onClick={() => this.toggleResizeMode()}>toggleResizeMode</button>
        <br /><br /><br />
        <pre>
        {JSON.stringify(
          {
            tableState: this.table.getState(),
          },
          null,
          2,
        )}
      </pre>
      </Host>
    );
  }

}
